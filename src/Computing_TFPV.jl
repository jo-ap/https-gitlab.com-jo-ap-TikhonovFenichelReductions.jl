## Computing a reduction

mutable struct Reduction
  idx::Vector{Bool}
  s::Int
  R::QQMPolyRing
  x::Vector{QQMPolyRingElem}
  θ::Vector{QQMPolyRingElem}
  _θ::Vector{QQMPolyRingElem}
  π::Vector{QQMPolyRingElem}
  idx_slow_fast::Vector{Bool}
  f::Vector{QQMPolyRingElem}
  f⁰::Vector{QQMPolyRingElem}
  f¹::Vector{QQMPolyRingElem}
  Df::AbstractAlgebra.Generic.MatSpaceElem{QQMPolyRingElem}
  Df_x₀::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  T::AbstractAlgebra.Generic.PolyRing{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  χ::AbstractAlgebra.Generic.Poly{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  M::Vector{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  x₀::Vector{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  K::AbstractAlgebra.Generic.FracField{QQMPolyRingElem}
  P::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  ψ::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  Dψ::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}
  success::Vector{Bool}
end

function splitsystem(f::Vector{QQMPolyRingElem}, π::Vector{QQMPolyRingElem}, idx::Vector{Bool})
  R = parent(f[1])
  f¹ = [evaluate(fᵢ, [π[idx]...], zeros(R, sum(idx))) for fᵢ in f]
  idx = idx .== false
  f⁰ = [evaluate(fᵢ, [π[idx]...], zeros(R, sum(idx))) for fᵢ in f]
  return f⁰, f¹
end

function jacobian(f::Vector{QQMPolyRingElem}, x::Vector{QQMPolyRingElem})
  matrix(parent(f[1]), [[derivative(fᵢ, xᵢ) for xᵢ in x] for fᵢ in f])
end

# construct Reduction type
function Reduction(problem::ReductionProblem, idx::Union{Vector{Bool}, Vector{Int}})
  R = parent(problem.f[1])
  K = fraction_field(R)
  _θ = copy(problem.θ)
  _θ[problem.idx_slow_fast] = problem.π.*idx
  n = length(problem.x)
  r = n - problem.s
  f⁰, f¹ = splitsystem(problem.f, problem.π, idx)
  Df = jacobian(problem.f, problem.x)
  T, _ = polynomial_ring(K, "λ")
  M = K.(problem.x)
  x₀ = zeros(K, n)
  P = zero_matrix(K,n,r)
  ψ = zero_matrix(K,r,1)
  Dψ = zero_matrix(K,r,n)
  Df_x₀ = matrix(K, Matrix(Df))
  return Reduction(idx, problem.s, R, problem.x, problem.θ, _θ, problem.π, problem.idx_slow_fast, problem.f, f⁰, f¹, Df, Df_x₀, T, T(0), M, x₀, K, P, ψ, Dψ, zeros(Bool, 3))
end

function parse_ring(R, x)
  try x = R.(x)
  catch
    println("Cannot parse $x into $R")
  end
  return x
end

function set_manifold!(reduction::Reduction, M::AbstractVector)
  M = parse_ring(reduction.K, M)
  n = length(reduction.x)
  @assert length(M) == n "The Manifold M must be defined in $n components."
  _f⁰ = [evaluate(fᵢ, [M; reduction.K.(reduction.θ)]) for fᵢ in reduction.f⁰]
  f_vanishes = all(iszero.(_f⁰))
  if !f_vanishes 
    @warn "f⁰ does no vanish on the slow manifold"
  else
    reduction.M = M
    reduction.success[1] = true
  end
  return f_vanishes
end

function eval_mat(M, x, v)
  m,n = size(M)
  _M = copy(M)
  for i = 1:m
    for j = 1:n
      _M[i,j] = evaluate(M[i,j], x, v)
    end
  end
  return _M
end
function eval_mat(M, v)
  m,n = size(M)
  K = parent(v[1])
  _M = matrix(K, Matrix(M))
  for i = 1:m
    for j = 1:n
      _M[i,j] = evaluate(M[i,j], v)
    end
  end
  return _M
end

function jacobian_tfpv_on_manifold(reduction::Reduction)
  eval_mat(reduction.Df, [reduction.M; reduction.K.(reduction._θ)])
end

function jacobian_tfpv(reduction::Reduction)
  eval_mat(reduction.Df, reduction.K.([reduction.x; reduction._θ]))
end

function set_point!(reduction::Reduction, x₀::AbstractVector)
  x₀ = parse_ring(reduction.K, x₀)
  n = length(reduction.x)
  @assert length(x₀) == n "The point x₀ must have $n components."
  # compute characteristic polynomial
  Df_x₀ = eval_mat(reduction.Df, [x₀; reduction.K.(reduction._θ)])
  χ = charpoly(reduction.T, Df_x₀)
  # check condition for coefficients
  c = collect(coefficients(χ))
  check_χ = all(iszero.(c[1:reduction.s])) && !iszero(c[reduction.s+1])
  if check_χ
    reduction.x₀ = x₀
    reduction.Df_x₀ = Df_x₀
    reduction.χ = χ
    reduction.success[2] = true
  else
    @warn "The eigenvalue λ does not factor the characteristic polynomial of D₁f(x₀,π) with power s=$(reduction.s)"
  end
  return check_χ 
end

# Set Product decomposition of f
function set_decomposition!(reduction::Reduction, P::AbstractAlgebra.Generic.MatSpaceElem,  ψ)
  n = length(reduction.x)
  r = n - reduction.s
  try ψ = reshape(ψ, r, 1)
  catch
    println("ψ must be of size $r or $r×1")
  end
  Dψ = jacobian(reshape(ψ, r), reduction.x)
  Dψ = parent(reduction.Dψ)(reduction.K.(Dψ))
  ψ = reduction.K.(ψ)
  ψ = parent(reduction.ψ)(ψ)
  P = reduction.K.(P)
  # check if product decomposition is correct
  # parse f⁰ as matrix, so that they can be compared
  M = P*ψ
  is_equal = all(iszero.(M .- parent(M)(reduction.f⁰)))
  if is_equal
    reduction.P = P
    reduction.ψ = ψ
    reduction.Dψ = Dψ
    reduction.success[3] = true
  else
    @warn "P⋅ψ ≠ f⁰: Product decomposition cannot be set"
  end
  return is_equal
end
function set_decomposition!(reduction::Reduction, P::VecOrMat, ψ)
  n = length(reduction.x)
  r = n - reduction.s
  try P = reshape(P, n, r)
  catch
    println("P must be of size $n×$r")
  end
  P = reduction.K.(P)
  P = parent(reduction.P)(P)
  set_decomposition!(reduction, P, ψ)
end

# try computing matrix of rational functions P from ψ
function get_P(reduction::Reduction, ψ::VecOrMat) 
  if size(ψ, 1) == 1
    P = reduction.f⁰.//ψ
  else 
      U, Q, H = reduce_with_quotients_and_unit(reduction.f⁰, ψ)
      @assert all(H .== 0) "Could not automatically compute P"
      P = U*Q
  end
  return P
end
function set_decomposition!(reduction::Reduction, ψ::VecOrMat)
  P = get_P(reduction, ψ)
  set_decomposition!(reduction, P, ψ)
end


function compute_reduction(reduction::Reduction)

  # Check if P-ψ-composition is defined 
  if reduction.success[3]

    # check if non-singular point is defined
    if !reduction.success[2]
      @info "The non-singular point on the slow manifold has not been set successfully. Trying to compute the reduction anyway."
    end

    # dimensions
    n = length(reduction.x)

    # compute reduced system
    A = reduction.Dψ*reduction.P
    Q = reduction.P*inv(A)*reduction.Dψ
    Iₙ = diagonal_matrix(reduction.K(1), n)
    F¹ = matrix_space(reduction.K, n, 1)(reduction.f¹)

    f_red_raw = (Iₙ - Q)*F¹

    # reshape as vector
    f_red = reshape(Matrix(f_red_raw), n)

  else
    # reduction cannot be computed
    @error "Reduced system cannot be computed. You need to set a valid product decomposition, i.e. P and ψ such that f⁰ = P⋅ψ"
    return nothing, nothing
  end

  # Check if slow manifold is set 
  if reduction.success[1]
    # substitute components according to slow manifold
    a = reduction.K.([reduction.M; reduction.θ])
    f_red_subs = [evaluate(f, a) for f in f_red]
    return f_red, f_red_subs
  else
    @warn "Slow manifold has not been defined succesfully. Reduced system is only returned in raw form, i.e. the reduced components are not substituted according to the slow manfold."
    return f_red, nothing
  end

end

