var documenterSearchIndex = {"docs":
[{"location":"gettingstarted/#Getting-Started","page":"Getting Started","title":"Getting Started","text":"","category":"section"},{"location":"gettingstarted/#Installation","page":"Getting Started","title":"Installation","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Run","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"add https://github.com/jo-ap/tikhonovfenichelreductions.jl","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"in Julia package Mode.","category":"page"},{"location":"gettingstarted/#Example","page":"Getting Started","title":"Example","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Here we consider the derivation of the Rosenzweig-MacArthur model as a reduction from a three dimensional system as demonstrated in [6]. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Load the package and its dependency Oscar.jl.  Note that loading Oscar is optional, but results in prettier printing of types. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"using Oscar\nusing TikhonovFenichelReductions","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Define the components, parameters and the RHS of the system. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"# components\nx = [\"B\", \"S\", \"H\"]\n\n# parameters\nθ = [\"α\", \"β\", \"γ\", \"δ\", \"η\", \"ρ\"]\n\n# RHS of ODE system ẋ = f(x, θ), where f is polynomial in x and θ\nfunction f(x, θ)\n  B, S, H = x\n  α, β, γ, δ, η, ρ = θ\n  return [\n    ρ*B*(1-B) - α*B*H,\n    -η*S + γ*B*H,\n    β*S- δ*H + η*S - γ*B*H\n  ]\nend","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Initialize the problem with desired dimension of the reduced system","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"# dimension of the reduced system\ns = 2\n\n# create problem\nprob = ReductionProblem(f, x, θ, s)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Compute all TFPV candidates by using necessary conditions for the existence of a reduction.  These are the vanishing of polynomial expressions arising from determinants of minors of the Jacobian and the Krull dimension of the variety containing the slow manifold. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"idx, G, (V, dim_Y) = tfpv_candidates(prob)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Show the results: All possible slow-fast separation of rates","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"print_candidates(idx, prob)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"the corresponding irreducible components containing the slow manifold","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"print_varieties(V, prob)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"and their Krull dimension","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"dim_Y","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"For further use, we need to make the variables (the system components and parameters) available in the Main namespace. Here we compute the reduction corresponding to TFPV 16, which is the  Rosenzweig-MacArthur model.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"B, S, H = prob.x\nα, β, γ, δ, η, ρ = prob.θ\n\n# instantiate reduction \nreduction = Reduction(prob, idx[16])","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"To find the slow manifold, we can consider the affine variety.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"V[16]","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"This means the slow manifold is  mathcalV(f^(0)) = mathcalV(H) = (BS0) mid BS in mathbbR, since there is only one component with dimension s=2 as desired:","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"dim_Y[16] ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Therefore, we can set the slow manifold accordingly.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"set_manifold!(reduction, [B, S, 0])","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Note that in this case any generic point on the affine variety is non-singular and can be chosen.   Thus, we don't have to call set_point! to set a non-singular point explicitly on whose neighbourhood the reduction exists. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Lastly, we define a product decomposition f^(0) = P cdot psi with  mathcalV(psi) = mathcalV(f^(0)) in some neighbourhood.  This can always be done by specifying only psi if n-s=1, as is the case here:","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"set_decomposition!(reduction, [H])","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Now we can compute the reduced system.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"_, g = compute_reduction(reduction)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"The first two components define the reduced system and can be rewritten as ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"beginalign*\nfracdBdt = rho B (1 - B) - alpha(eta + beta) S fracBdelta + gamma B \nfracdSdt = -eta S + gamma(eta + beta) S fracBdelta + gamma B \nendalign*","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"which is exactly the Rosenzweig-MacArthur model.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"The slow manifold is attractive if all non-zero eigenvalues of the Jacobian at the non-singular x₀ point have negative real part. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"reduction.Df_x₀","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Thus, the full system converges to the reduction as varepsilon to 0 if  B  fracdeltagamma. ","category":"page"},{"location":"math_background/#Mathematical-Background","page":"Mathematical Background","title":"Mathematical Background","text":"","category":"section"},{"location":"api/#API-Reference","page":"API Reference","title":"API Reference","text":"","category":"section"},{"location":"api/#Finding-Tikhonov-Fenichel-Parameter-Values","page":"API Reference","title":"Finding Tikhonov-Fenichel Parameter Values","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [TikhonovFenichelReductions]\nPages = [\"Finding_TFPV.jl\"]\nPrivate = false\nOrder = [:type, :function]","category":"page"},{"location":"api/#TikhonovFenichelReductions.ReductionProblem","page":"API Reference","title":"TikhonovFenichelReductions.ReductionProblem","text":"mutable struct ReductionProblem\n\nType that defines a Tikhonov-Fenichel reduction problem, i.e. a polynomial ODE system, for which all slow-fast separations of rates yielding a reduction onto dimension s are considered. \n\nFields\n\nf::Vector{QQMPolyRingElem}: RHS of ODE system as a vector of polynomials\nx::Vector{QQMPolyRingElem}: Vector of dynamic variables\nθ::Vector{QQMPolyRingElem}: Vector of all parameters\ns::Int: Dimension of reduced system\nπ::Vector{QQMPolyRingElem}: Vector of parameters to be considered slow or fast\nidx_slow_fast::Vector{Bool}: Boolean index, such that π=ϑ[idx_slow_fast]\nJ::AbstractAlgebra.Generic.MatSpaceElem{QQMPolyRingElem}: Jacobian of f\n_f::Function: RHS of ODE system as a Julia function with arguments x and ϑ\n\nThe type QQMPolyRingElem is used in Oscar.jl to represent elements of a polynomial ring; here this is ℝ[x,θ].\n\n\n\n\n\n","category":"type"},{"location":"api/#TikhonovFenichelReductions.ReductionProblem-Tuple{Function, Vector{String}, Vector{String}, Int64}","page":"API Reference","title":"TikhonovFenichelReductions.ReductionProblem","text":"ReductionProblem(\n    f::Function,\n    x::Vector{String},\n    θ::Vector{String},\n    s::Int64;\n    idx_slow_fast\n) -> ReductionProblem\n\n\nConstructor for ReductionProblem Type.\n\nArguments\n\nf(x,θ)::Function: Julia function defining the RHS of system \nx::Vector{String}: Vector of dynamic variables \nθ::Vector{String}: Vector of all parameters\ns::Int: Dimension of reduced system \nidx_slow_fast::Vector{Bool}: Boolean index for all rates that are either small or large (all others are considered fixed)\n\nDescription\n\nThis function is used to setup the problem of finding Tikhonov-Fenichel Parameter Values, i.e. slow-fast separations of rates that yield a reduction onto an s-dimensional system.  The names of all variables and parameters in the system are parsed to appropriate types in Oscar.jl, so that the necessary conditions for the existence of such a reduction can be evaluated.\n\nSee also: tfpv_candidates\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.filter_determinants-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.filter_determinants","text":"filter_determinants(\n    problem::ReductionProblem;\n    idx,\n    multithreading\n) -> Tuple{Vector{Vector{Bool}}, Vector{Nemo.QQMPolyRingElem}}\n\n\nUse the conditions imposed by the RHS of the polynomial ODE System and its Jacobian to filter out TFPV candidates. \n\nDescription\n\nIf π⁺ is a TFPV yielding a reduction onto an s-dimensional slow manifold, there exist a point x₀, such that \n\nf(x₀,π⁺)=0\nfor any k>s the determinants of all k×k minors of D₁f(x₀,π⁺) vanish\nτ divides the characteristic polynomial Χ(τ) of D₁f(x₀,π⁺) exactly with power s\n\nThese properties can be used to filter out possible TFPV candidates.\n\nBy default, all 2ᵐ-2 possible slow-fast separations of the m parameters are considered, but if idx::Vector{Vector{Bool}} is defined, checking of the conditions is only performed on those candidates.\n\nThis function can be multithreaded by setting multithreading=true. Note that multithreading has to be enabled when the julia session is started (e.g. by julia --threads=auto, see the manual).\n\nSee also: filter_dimension\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.filter_dimension-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.filter_dimension","text":"filter_dimension(\n    problem::ReductionProblem;\n    idx,\n    compute_primary_decomposition,\n    exact_dimension\n) -> Tuple{Vector{Vector{Bool}}, Tuple{Union{Nothing, Vector{Any}}, Union{Nothing, Vector{Vector{Int64}}}}}\n\n\nUse the Krull dimension of the ideal generated by the unperturbed part of the system to filter out TFPV candidates form all possible slow-fast separations. \n\nDescription\n\nThe slow manifold on which the reduced system is defined is contained in 𝑉(f⁰), the affine variety of f⁰, i.e. the zero set of the fast / unperturbed part of the system (when we consider the entries as polynomials in the dynamic varieties x, so that the variety is a subset of the phase space). Thus, 𝑉(f⁰) needs to have an irreducible component with dimension s, which we can check using the Krull dimension of the corresponding ideal.\n\nBy default, all 2ᵐ-2 possible slow-fast separations of the m parameters are checked, but if idx::Vector{Vector{Bool}} is defined, only those candidates are considered (0: slow variable, 1: fast variable).\n\nIf compute_primary_decomposition=true (default behaviour) is set, the function attempts to compute a primary decomposition of the ideal corresponding to the unperturbed part of the system f⁰.\n\nIf in addition, exact_dimension=true (default), only those candidates are kept for which the affine variety has exactly dimension problem.s. Keep in mind that this is the Krull dimension, so the topological dimension over the reals can be smaller. However, the existence of a non-singular point in the irreducible component implies that topological and Krull dimension are equal.  Since we require such a point later, we may use the exact dimension already. \n\nSee also: filter_determinants\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.tfpv_candidates-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.tfpv_candidates","text":"tfpv_candidates(\n    problem;\n    compute_primary_decomposition,\n    exact_dimension,\n    multithreading\n)\n\n\nCompute all TFPV candidates for the defined reduction problem by using the determinants criteria and asserting correct dimension of the slow manifold.  This combines the functions filter_determinants and filter_dimension.\n\nSee also filter_determinants, filter_dimension\n\n\n\n\n\n","category":"method"},{"location":"api/#Computing-a-Tikhonov-Fenichel-Reduction","page":"API Reference","title":"Computing a Tikhonov-Fenichel Reduction","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [TikhonovFenichelReductions]\nPages = [\"Computing_TFPV.jl\"]\nPrivate = false\nOrder = [:type, :function]","category":"page"},{"location":"api/#TikhonovFenichelReductions.Reduction","page":"API Reference","title":"TikhonovFenichelReductions.Reduction","text":"mutable struct Reduction\n\nType that holds all information to compute a Tikhonov-Fenichel reduction for a given slow-fast separation of rates.\n\nFields\n\nidx::Vector{Bool}: slow-fast separation (0: slow, 1: fast)\ns::Int: Dimension of reduced system (= dimension of slow manifold)\nR::QQMPolyRing: Ring over rationals in x and θ\nx::Vector{QQMPolyRingElem}: Dynamic variables of system \nθ::Vector{QQMPolyRingElem}: All parameters\n_θ::Vector{QQMPolyRingElem}: All parameters, where slow parameters are set to 0\nπ::Vector{QQMPolyRingElem}: Parameters, that are considered to be either small or large\nidx_slow_fast::Vector{Bool}: Boolean indices, s.t. π=θ[idx_slow_fast]\nf::Vector{QQMPolyRingElem}: RHS of system as vector with elements of ring R\nf⁰::Vector{QQMPolyRingElem}: Fast / unperturbed part of system as vector with elements of ring R\nf¹::Vector{QQMPolyRingElem}: Slow / perturbed part of system as vector with elements of ring R\nDf::AbstractAlgebra.Generic.MatSpaceElem{QQMPolyRingElem}: Jacobian of f\nDf_x₀::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Jacobian of f at non-singular point x₀\nT::AbstractAlgebra.Generic.PolyRing{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Ring in x over Fraction field K\nchi::AbstractAlgebra.Generic.Poly{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Characteristic polynomial of Df_x₀\nM::Vector{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Slow manifold defined in all components of system\nx₀::Vector{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Non-singular point in the irreducible component of V(f⁰) containing the slow manifold\nK::AbstractAlgebra.Generic.FracField{QQMPolyRingElem}: Fraction field in θ\nP::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Matrix with rational functions, such that f⁰=P⋅ψ\nψ::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Vector with polynomials, such that f⁰=P⋅ψ\nDψ::AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{QQMPolyRingElem}}: Jacobian of ψ\nsuccess::Vector{Bool}: Indicates whether slow manifold M, non-singular point x₀ and product decomposition f⁰=P⋅ψ have been set successfully\n\n\n\n\n\n","category":"type"},{"location":"api/#TikhonovFenichelReductions.Reduction-Tuple{ReductionProblem, Vector{Bool}}","page":"API Reference","title":"TikhonovFenichelReductions.Reduction","text":"Reduction(\n    problem::ReductionProblem,\n    idx::Vector{Bool}\n) -> Reduction\n\n\nConstructor for Reduction Type.\n\nArguments\n\nproblem::ReductionProblem: Reduction problem type holding information on system and dimension of reduction.\nidx::Union{Vector{Bool}, Vector{Int}}: Boolean index indicating slow-fast separation of rates (0: small, 1: large).\n\nSee also: set_manifold!, set_decomposition!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.compute_reduction-Tuple{Reduction}","page":"API Reference","title":"TikhonovFenichelReductions.compute_reduction","text":"compute_reduction(\n    reduction::Reduction\n) -> Tuple{Union{Nothing, Vector{AbstractAlgebra.Generic.FracFieldElem{Nemo.QQMPolyRingElem}}}, Union{Nothing, Vector{_A} where _A}}\n\n\nCompute the reduced system after the slow manifold, non-singular point and product decomposition have been set successfully.\n\nThe function returns a tuple containing the reduced system in raw form and with variables substituted according to the slow manifold.\n\nSee also: set_manifold!, set_decomposition!, set_point!, Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_decomposition!-Tuple{Reduction, AbstractAlgebra.Generic.MatSpaceElem, Any}","page":"API Reference","title":"TikhonovFenichelReductions.set_decomposition!","text":"set_decomposition!(\n    reduction::Reduction,\n    P::AbstractAlgebra.Generic.MatSpaceElem,\n    ψ\n) -> Any\n\n\nSet product decomposition f⁰=P⋅ψ locally satisfying 𝑉(f⁰)=𝑉(ψ), where P is a matrix of rational functions  and ψ is a vector of polynomials.\n\nVariants:\n\nset_decomposition!(reduction::Reduction, P::AbstractAlgebra.Generic.MatSpaceElem, ψ): Manually specify P and ψ\nset_decomposition!(reduction::Reduction,  ψ): Try to compute P automatically. This works always for s=1, but may fail if s>1.\n\nDescription\n\nTypically, ψ can be chosen from s independent entries of f⁰.  Practically one can consider the generators of the ideals defining the irreducible components of 𝑉(f⁰) as entries for ψ (possibly rewriting the rational equations as polynomials by multiplying appropriately with parameters occurring in a denominator).\n\nSee also: set_manifold!, set_point!, Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_manifold!-Tuple{Reduction, AbstractVector{T} where T}","page":"API Reference","title":"TikhonovFenichelReductions.set_manifold!","text":"set_manifold!(\n    reduction::Reduction,\n    M::AbstractVector{T} where T\n) -> Bool\n\n\nSet the slow manifold by defining the values of the components of the system. Note that M must be defined as a vector with the same length as the system's components, i.e. reduction.x.\n\nSee also: Reduction, set_decomposition!, set_point!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_point!-Tuple{Reduction, AbstractVector{T} where T}","page":"API Reference","title":"TikhonovFenichelReductions.set_point!","text":"set_point!(\n    reduction::Reduction,\n    x₀::AbstractVector{T} where T\n) -> Bool\n\n\nSet non-singular point on irreducible component of V(f⁰) corresponding to the slow manifold.  Typically, this can be done automatically by setting the slow manifold.\n\nSee also: set_manifold!, set_decomposition!, Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#Output","page":"API Reference","title":"Output","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"print_candidates\nprint_varieties","category":"page"},{"location":"api/#TikhonovFenichelReductions.print_candidates","page":"API Reference","title":"TikhonovFenichelReductions.print_candidates","text":"print_candidates(\n    idx::Vector{Vector{Bool}},\n    prob::ReductionProblem;\n    latex\n) -> Union{Nothing, LaTeXStrings.LaTeXString}\n\n\nPrint TFPV candidates to terminal or return LaTeXString that can be included in tex file.\n\n\n\n\n\n","category":"function"},{"location":"api/#TikhonovFenichelReductions.print_varieties","page":"API Reference","title":"TikhonovFenichelReductions.print_varieties","text":"print_varieties(\n    V,\n    prob::ReductionProblem;\n    latex\n) -> Union{Nothing, LaTeXStrings.LaTeXString}\n\n\nPrint generators of ideals in corresponding to irreducible components of varieties for TFPV candidates to terminal (V as returned by filter_dimension or tfpv_candidates).\n\nSee also: filter_dimension, tfpv_candidates\n\n\n\n\n\n","category":"function"},{"location":"references/#References","page":"References","title":"References","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"A. Goeke and S. Walcher. Quasi-Steady State: Searching for and Utilizing Small Parameters. In: Recent Trends in Dynamical Systems, Vol. 35, edited by A. Johann, H.-P. Kruse, F. Rupp and S. Schmitz (Springer Basel, 2013); pp. 153–178.\n\n\n\nA. Goeke and S. Walcher. A Constructive Approach to Quasi-Steady State Reductions. Journal of Mathematical Chemistry 52, 2596–2626 (2014).\n\n\n\nA. Goeke, S. Walcher and E. Zerz. Determining \"Small Parameters\" for Quasi-Steady State. Journal of Differential Equations 259, 1149–1180 (2015).\n\n\n\nA. N. Tikhonov. Systems of differential equations containing small parameters in the derivatives. Matematicheskii sbornik 73, 575–586 (1952).\n\n\n\nN. Fenichel. Geometric Singular Perturbation Theory for Ordinary Differential Equations. Journal of Differential Equations 31, 53–98 (1979).\n\n\n\nN. Kruff, C. Lax, V. Liebscher and S. Walcher. The Rosenzweig–MacArthur System via Reduction of an Individual Based Model. Journal of Mathematical Biology 78, 413–439 (2019).\n\n\n\n","category":"page"},{"location":"#TikhonovFenichelReductions.jl","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"A Julia package for computing Tikhonov-Fenichel Parameter Values (TFPVs) for a polynomial ODE system and the corresponding reductions (see  [1–3] for details).","category":"page"},{"location":"#Overview","page":"TikhonovFenichelReductions.jl","title":"Overview","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"The general framework for this package is singular perturbation theory. More precisely, we consider an ODE system of the form ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"dotx = f(xpi varepsilon) quad x(0)=x_0 x in UsubseteqmathbbR^n pi in Pi subseteq mathbbR^m","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"where f in mathbbRxpi is polynomial and varepsilon geq 0 is a small parameter. The results from [1–3] allow us to compute a reduced system for varepsilon to 0 in the sense of Tikhonov [4] and Fenichel [5] using methods from commutative algebra and algebraic geometry. ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"TikhonovFenichelReductions.jl implements methods for finding all possible TFPV candidates, i.e. separations of parameters into small and large (which in turn correspond to slow-fast separations of processes in the original system). It also includes functions to simplify the computation of corresponding reduced systems. Note that this approach yields all possible time-scale separations of rates and not just components as in the classical approach.","category":"page"},{"location":"#Basic-Usage","page":"TikhonovFenichelReductions.jl","title":"Basic Usage","text":"","category":"section"},{"location":"#Finding-TFPV-candidates","page":"TikhonovFenichelReductions.jl","title":"Finding TFPV candidates","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"The main functionality is:","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"# Setup\nproblem = ReductionProblem(f, x, θ, s, idx_slow_fast)\n\n# Compute TFPV candidates\nidx, G, (V, dim_Y) = tfpv_candidates(problem)","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"This sets up the problem. The input is a (Julia) function f(x,θ) defining f and a vector of strings with the names of the dynamic variables x and parameters theta, respectively.  f needs to be a multivariate polynomial in x and theta defining the RHS of the original system. The dimension of the reduced system is s  n.   π=θ[idx_slow_fast] are the parameters that should be considered to be either small or large, i.e. all other parameters are fixed. ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"The output is a vector of boolean indices idx, where 0 corresponds to a small and 1 to a large parameter.  G is a Gröbner basis of an ideal in mathbbRpi (the elimination ideal of f and all determinants of ktimes k minors of the Jacobian for any ks).  All TFPVs are contained in the affine variety of G, i.e. all polynomials in G need to vanish for a TFPV pi^star in order for a reduction to exist. Vcontains the generators of primary ideals that correspond to the irreducible components of the affine variety mathcalV(f(cdotpi)).  By affine variety we simply think of the zero set of some polynomials (or ideal, for which it is enough to consider its generators) the in the corresponding affine space. In this case, we take the polynomials in f as elements of the ring mathbbRx and pi as coefficients (in fact, technically we work in the polynomial ring mathbbR(pi)x).","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"If finding TFPV candidates takes too long, you can disable the computation of the irreducible components of V by setting compute_primary_decomposition=false. dim_Y contains the Krull dimension of the irreducible components.  These are equal to the topological dimensions in mathbbCx, but can be larger in mathbbRx.  However, they are also equal over the reals if a component contains a non-singular point –- which we will require later anyway.  We can therefore use this information already to discard unwanted cases.  The default behaviour is to compute a primary decomposition and to check if any component's dimension is exactly s.  If you want to disable this filter, you can set exact_dimension=false (this only has an effect if compute_primary_decomposition=true).","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"The functions ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"print_tfpv(idx, prob)\nprint_varieties(V, prob)","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"print out the results in a simple format directly to the REPL.  You can use the additional argument latex=true to print output as LaTeX source code. ","category":"page"},{"location":"#Limitations","page":"TikhonovFenichelReductions.jl","title":"Limitations","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"The method tfpv_candidates can only find TFPV candidates for which a subset of the original parameters is set to zero.  For more complicated candidates, i.e. when some function of the parameters is small,  one has to consider the Gröbner Basis G directly. These 'alternative TFPVs' are rational functions whose vanishing results in the vanishing of G.","category":"page"},{"location":"#Computing-the-reduced-system","page":"TikhonovFenichelReductions.jl","title":"Computing the reduced system","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"To compute the reduced system, we first need to make the variables available in the Main namespace (parsed to the appropriate types from  Oscar.jl). These can be accessed as problem.x and problem.θ.  Then, we initialise a reduction by constructing an instance of type Reduction.  For the first slow-fast separation in idx, this can be done with ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"reduction = Reduction(prob, idx[1])","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"Looking at V[1], we can see what a possible slow manifold should be,  since it is contained in one of the irreducible components of the vanishing set of the ideal generated by the polynomials in V[1] Each V[i] is a vector containing the generators of these ideals (as a vector of polynomials).","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"Before we can compute the reduced system, we can check if the necessary conditions for its existence are satisfied.  These can be found in [1-3]. Essentially, we need to find a manifold of dimension s contained in mathcalV(f(cdot theta^star)), a non-singular point x_0 on this manifold and a product decomposition  f(cdot theta^star) = Pcdot psi  that locally satisfies  mathcalV(f(x theta^star)) = mathcalV(psi).","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"# define the slow manifold M₀ (M₀ has to have the same format as problem.x)\nset_manifold!(reduction, M₀)\n\n# choose a non-singular point x₀ on M₀\nset_point!(reduction, x₀)\n\n# define a product decomposion f⁰ = P⋅ψ, where ψ is a r×1 matrix of polynomials\n# locally satisfying V(ψ) = V(f⁰). \nset_decomposition!(reduction, P, ψ)\n# or compute P automatically\nset_decomposition!(reduction, ψ)","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"When setting the slow manifold, a check is performed that indicates whether a generic point on the manifold can be non-singular. If that is not the case, a warning is printed. Otherwise the generic point is set for the reduction (the method set_point is only useful when a specific point should be chosen, i.e. one that simplifies the Jacobian at x_0). ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"If you choose ψ as a vector of polynomials in mathbbRxpi, it should be possible to automatically compute P (which is then a matrix of rational functions).  However, as of now this might fail in complicated cases, but is guaranteed to work if r=n-s=1.","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"If all the conditions for the slow manifold, the non-singular point and the product decomposition are satisfied (indicated by the return value true of each function), we can compute the reduced system with","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"g_raw, g = compute_reduction(reduction)","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"where g corresponds to the RHS of the reduced system on M₀. g_raw is the same function, but before substituting the reduced dynamic variables.","category":"page"},{"location":"#Dependencies","page":"TikhonovFenichelReductions.jl","title":"Dependencies","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"This packages only works due to the great Oscar.jl project.","category":"page"},{"location":"#License","page":"TikhonovFenichelReductions.jl","title":"License","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"GNU GENERAL PUBLIC LICENSE, Version 3 or later (see LICENSE)","category":"page"}]
}
