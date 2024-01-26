## ReductionProblem holds all relevant information to find TFPV candidates

# custom type to store info concerning a system for which we search
# Tikhonov-Fenichel Parameter Values
mutable struct ReductionProblem 
  f::Vector{QQMPolyRingElem}
  x::Vector{QQMPolyRingElem}
  θ::Vector{QQMPolyRingElem}
  s::Int
  π::Vector{QQMPolyRingElem}
  idx_slow_fast::Vector{Bool}
  J::AbstractAlgebra.Generic.MatSpaceElem{QQMPolyRingElem}
  _f::Function
end

# get boolean index for subset of parameters that can be considered small
function get_idx_π(π::Vector{String}, θ::Vector{String})
  Bool.(sum([πᵢ .== θ for πᵢ∈π]; dims=1)[1])
end

# constructor
function ReductionProblem(f::Function, x::Vector{String}, θ::Vector{String}, s::Int, idx_slow_fast::Vector{Bool})
  _, _x, _θ, _f = parse_system(f, x, θ)
  _π = _θ[idx_slow_fast]
  J = jacobian(_f, _x)
  ReductionProblem(_f, _x, _θ, s, _π, idx_slow_fast, J, f)
end
ReductionProblem(f::Function, x::Vector{String}, θ::Vector{String}, s::Int) = ReductionProblem(f, x, θ, s, ones(Bool, length(θ)))
ReductionProblem(f::Function, x::Vector{String}, θ::Vector{String}, s::Int, π::Vector{String}) = ReductionProblem(f, x, θ, s, get_idx_π(π, θ))


## Helper Functions
"""
    parse_system(f::Function, x::Vector{String}, θ::Vector{String})

Parse dynamic variables `x` and parameters `θ` of polynomial ODE system so that
they can be used with Oscar.jl. Return the polynomial Ring `R = ℚ[x,θ]`
together with `x`, `θ` and `f` parsed to the appropriate OSCAR types.
"""
function parse_system(f::Function, x::Vector{String}, θ::Vector{String})
  R, v = PolynomialRing(QQ, [x..., θ...])
  _x = v[1:length(x)]
  _θ = v[length(x)+1:end]
  _f = f(_x, _θ)
  return R, _x, _θ, _f
end

"""
    num2bin(i, n)

Convert integer `i` into a boolean vector of length `n` representing `i` in
binary.
"""
function num2bin(i::Int, n::Int)
  idx = bitstring(i)[(end-n+1):end]
  idx = [i == '1' for i in idx]
end

"""
    get_determinants(M, r)

Compute determinants of all possible k×k minors of quadratic matrix `M` for
k>`r`.
"""
function get_determinants(M::AbstractAlgebra.Generic.MatSpaceElem{QQMPolyRingElem}, r::Int)
  n = size(M)[1]
  @assert n == size(M)[2] "M must be a quadratic matrix."
  # get all valid combinations of rows and columns
  combinations = num2bin.(1:2^n, n)
  combinations = combinations[sum.(combinations) .> r]
  l_s = sum([binomial(n, k)^2 for k = (r+1):(n-1)])
  d = Vector{QQMPolyRingElem}(undef, l_s+1)
  idx = collect(1:n)
  i = 1
  for row in combinations 
    for col in combinations[sum.(combinations) .== sum(row)]
      d[i] = det(M[idx[row], idx[col]])
      i += 1
    end
  end
  return d
end

"""
    allvanish(F, π)

Check if all polynomials in `F` vanish for all parameters in `π` set to zero.
"""
function allvanish(F::Vector{QQMPolyRingElem}, π::Vector{QQMPolyRingElem})
  z = zeros(parent(π[1]), length(π))
  for f∈F
    if !iszero(evaluate(f, π, z))
      return false
    end
  end
  return true
end

## Filter functions
"""
    filter_dimension(prob::ReductionProblem; idx=nothing)

Use the Krull dimension of the ideal generated by the unperturbed part of the
input system to filter out TFPV candidates form all possible slow-fast
separations. 


By default all 2ᵐ-2 possible slow-fast separations of the m parameters are
checked, but if `idx::Vector{Vector{Bool}}` is defined, only those candidates
are checked (0: slow variable, 1: fast variable).


If `compute_primary_decomposition=true` (default behaviour) is set, the
function attempts to compute a primary decomposition of the ideal corresponding
to the unperturbed part of the system `f⁰`.


See also: [`num2bin`](@ref), [`filter_determinants`](@ref)
"""
function filter_dimension(problem::ReductionProblem; idx=nothing, compute_primary_decomposition::Bool=true)

  # redefine RHS of ode system: Interpret parameters as coefficients and only
  # use dynamic variables as variables for the polynomial ring
  x_str = string.(problem.x)
  θ_str = string.(problem.θ)
  K, θ = RationalFunctionField(QQ, θ_str)
  R, x = PolynomialRing(K, x_str)
  π = θ[problem.idx_slow_fast]

  # filter TFPV candidates 
  idx = isnothing(idx) ? num2bin.(1:(2^length(π)-2), length(problem.π)) : idx
  idx_candidates = zeros(Bool, length(idx))
  V = compute_primary_decomposition ? [] : nothing
  cnt = 1
  for i in idx    
    # Get unperturbed part of system (fast part)
    _θ = θ
    _θ[problem.idx_slow_fast] = π .* i 
    f⁰ = problem._f(x, _θ)
    # Check if Krull dimension is at least s
    if dim(ideal(R, f⁰)) >= problem.s
      idx_candidates[cnt] = true
      if compute_primary_decomposition 
        I = ideal(R, R.(f⁰))
        PD = primary_decomposition(I)
        push!(V, [gens(Q[2]) for Q in PD])
      end
    end
    cnt += 1
  end

  # convert boolean index to numerical index
  idx_candidates = idx[idx_candidates]

  return idx_candidates, V

end

"""
    filter_determinants(problem::ReductionProblem; idx=nothing, multithreading=false)

Use the conditions defined by the RHS of the polynomial ODE System and its
Jacobian to filter out TFPVs. 

By default all 2ᵐ-2 possible slow-fast separations of the m parameters are
checked, but if `idx::Vector{Vector{Bool}}` is defined, only those candidates
are checked (0: slow variable, 1: fast variable).

This function can be multithreaded by setting `multithreading=true`. Note that
multithreading has to be enabled when the julia session is started (e.g. by
'julia --threads=auto', See https://docs.julialang.org/en/v1/manual/multi-threading").

See also: [`num2bin`](@ref), [`filter_dimension`](@ref)
"""
function filter_determinants(problem::ReductionProblem; idx=nothing, multithreading=false)
  
  # number of dimensions to reduce the system by
  r = length(problem.x) - problem.s

  # determinants of all k×k minors of J for k>r
  d = get_determinants(problem.J, r)

  # All polynomials that generate the ideal used to determine TFPVs
  poly_gens = [problem.f; d]

  # Build ideal from polynomial expressions 
  I = ideal(parent(problem.f[1]), poly_gens)

  # eliminate dynamic variables
  Iₓ = eliminate(I, problem.x)

  # Generating set for Iₓ (this is a Gröbner Basis)
  G = gens(Iₓ)

  # filter TFPV candidates 
  idx = isnothing(idx) ? num2bin.(1:(2^length(problem.π)-2), length(problem.π)) : idx
  idx_candidates = zeros(Bool, length(idx))
  cnt = 1
  if multithreading && Threads.nthreads() > 1
    Threads.@threads for i in idx    
      # get all small parameters
      idx_slow = i .== false
      # check if all g∈G vanish if small parameters are set to zero
      idx_candidates[cnt] = allvanish(G, problem.π[idx_slow])
      cnt += 1
    end
  else 
    if multithreading
      @info "Using only one thread. Multi-threading can be enabled by starting julia with e.g. '--threads=auto' or '--threads=4'. \nSee https://docs.julialang.org/en/v1/manual/multi-threading"
    end
    for i in idx    
      # get all small parameters
      idx_slow = i .== false
      # check if all g∈G vanish if small parameters are set to zero
      idx_candidates[cnt] = allvanish(G, problem.π[idx_slow])
      cnt += 1
    end
  end

  # convert boolean index to numerical index
  idx_candidates = idx[idx_candidates]

  return idx_candidates, G
end

"""
    tfpv_candidates(problem::ReductionProblem; multithreading=false)

Compute all TFPV candidates for the defined problem.
See also [`filter_determinants`](@ref), [`filter_dimension`](@ref)

"""
function tfpv_candidates(problem::ReductionProblem; compute_primary_decomposition::Bool=true, multithreading::Bool=false)

  # Use determinants as first filter
  idx_det, G = filter_determinants(problem; multithreading=multithreading)

  # Use Krull dimension as second filter
  idx_TFPV, V = filter_dimension(problem; idx=idx_det, compute_primary_decomposition=compute_primary_decomposition) 

  # Return numerical indices of TFPV candidates (together with Gröbner Basis G
  # for the elimination ideal and the irreducible components of the varieties
  # V(h(⋅,π)) given by a primary decomposition)
  return idx_TFPV, G, V
end
