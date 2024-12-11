var documenterSearchIndex = {"docs":
[{"location":"gettingstarted/#Getting-Started","page":"Getting Started","title":"Getting Started","text":"","category":"section"},{"location":"gettingstarted/#Installation","page":"Getting Started","title":"Installation","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Run","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"add https://github.com/jo-ap/tikhonovfenichelreductions.jl","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"in Julia package Mode.","category":"page"},{"location":"gettingstarted/#Example","page":"Getting Started","title":"Example","text":"","category":"section"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Here we consider the derivation of the Rosenzweig-MacArthur model as a reduction from a three dimensional system as demonstrated in [7]. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Load the package and its dependency Oscar.jl.  Note that loading Oscar is optional, but results in prettier printing of types and imports useful functions.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"using Oscar # optional\nusing TikhonovFenichelReductions","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Define the components, parameters and the RHS of the system. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"# components\nx = [\"B\", \"S\", \"H\"]\n\n# parameters\np = [\"α\", \"β\", \"γ\", \"δ\", \"η\", \"ρ\"]\n\n# RHS of ODE system ẋ = f(x, p), where f is polynomial in x and p\nfunction f(x, p)\n  B, S, H = x\n  α, β, γ, δ, η, ρ = p\n  return [\n    ρ*B*(1-B) - α*B*H,\n    -η*S + γ*B*H,\n    β*S- δ*H + η*S - γ*B*H\n  ]\nend","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Initialize the problem with desired dimension of the reduced system","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"# dimension of the reduced system\ns = 2\n\n# create problem\nproblem = ReductionProblem(f, x, p, s)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Compute all slow-fast separations that are TFPVs by using necessary conditions for the existence of a reduction. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"sf_separation, V, dim_V = tfpv_candidates(problem)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"You can also get all general TFPVs by computing a Gröbner basis G that reflects necessary conditions on the parameters of the system.  Note that this is potentially a very computationally intensive task.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"G = tfpv_groebner_basis(problem)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Show the results: All possible slow-fast separation of rates ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"print_tfpv(problem, sf_separation)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"and the corresponding irreducible components containing the slow manifold and their Krull dimension","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"print_varieties(V, dim_V)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"For further use, we need to make the variables (the system components and parameters) available in the Main namespace. Then, we can compute the reduction corresponding to TFPV 15, which is the Rosenzweig-MacArthur model.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"B, S, H = system_components(problem)\nα, β, γ, δ, η, ρ = system_parameters(problem)\n\n# instantiate reduction \nreduction = Reduction(problem, sf_separation[15])","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"To find the slow manifold, we can consider the affine variety defined by the vanishing of","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"V[15]","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We can see, that there is only one irreducible component, so the slow manifold is  mathcalV(f^(0)) = mathcalV(H) = (BS0) mid BS in mathbbR with dimension s=2 as desired:","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"dim_V[15] ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"We need to define the slow manifold explicitly in order to check whether the reduction exists.  This also allows us to substitute the variables that got reduced according to the slow manifold in the reduced system.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"set_manifold!(reduction, [B, S, 0])","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Note that in this case any generic point on the affine variety is non-singular and can be chosen.   Thus, we don't have to call set_point! to set a non-singular point explicitly on whose neighbourhood the reduction exists. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Lastly, we define a product decomposition f^(0) = P cdot psi with  mathcalV(psi) = mathcalV(f^(0)). If n-s=1, this can always be done by specifying only psi: here:","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"set_decomposition!(reduction, [H])","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Now we can compute the reduced system.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"_, g = compute_reduction(reduction)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"This returns the system before and after variables are substituted as defined by the slow manifold, respectively. The first two components g define the reduced system and can be rewritten as ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"beginalign*\nfracdBdt = rho B (1 - B) - alpha(eta + beta) S fracBdelta + gamma B \nfracdSdt = -eta S + gamma(eta + beta) S fracBdelta + gamma B \nendalign*","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"which is exactly the Rosenzweig-MacArthur model.","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"The slow manifold is attractive if all non-zero eigenvalues of the Jacobian at the non-singular x0 point have negative real part. ","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"# pretty-print Jacobian at x0\nJ = jacobian_tfpv_at_x0(reduction)\nshow(stdout, \"text/plain\", J)","category":"page"},{"location":"gettingstarted/","page":"Getting Started","title":"Getting Started","text":"Thus, the full system converges to the reduction as varepsilon to 0 if  B geq 0. ","category":"page"},{"location":"references/#References","page":"References","title":"References","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"A. Goeke and S. Walcher. Quasi-Steady State: Searching for and Utilizing Small Parameters. In: Recent Trends in Dynamical Systems, Vol. 35, edited by A. Johann, H.-P. Kruse, F. Rupp and S. Schmitz (Springer Basel, 2013); pp. 153–178.\n\n\n\nA. Goeke and S. Walcher. A Constructive Approach to Quasi-Steady State Reductions. Journal of Mathematical Chemistry 52, 2596–2626 (2014).\n\n\n\nA. Goeke, S. Walcher and E. Zerz. Determining \"Small Parameters\" for Quasi-Steady State. Journal of Differential Equations 259, 1149–1180 (2015).\n\n\n\nA. N. Tikhonov. Systems of differential equations containing small parameters in the derivatives. Matematicheskii sbornik 73, 575–586 (1952).\n\n\n\nN. Fenichel. Geometric Singular Perturbation Theory for Ordinary Differential Equations. Journal of Differential Equations 31, 53–98 (1979).\n\n\n\nF. Verhulst. Singular Perturbation Methods for Slow–Fast Dynamics. Nonlinear Dynamics 50, 747–753 (2007).\n\n\n\nN. Kruff, C. Lax, V. Liebscher and S. Walcher. The Rosenzweig–MacArthur System via Reduction of an Individual Based Model. Journal of Mathematical Biology 78, 413–439 (2019).\n\n\n\n","category":"page"},{"location":"api/#API-Reference","page":"API Reference","title":"API Reference","text":"","category":"section"},{"location":"api/#Finding-Tikhonov-Fenichel-Parameter-Values","page":"API Reference","title":"Finding Tikhonov-Fenichel Parameter Values","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [TikhonovFenichelReductions]\nPages = [\"tfpv.jl\"]\nPrivate = false\nOrder = [:type, :function]","category":"page"},{"location":"api/#TikhonovFenichelReductions.ReductionProblem","page":"API Reference","title":"TikhonovFenichelReductions.ReductionProblem","text":"mutable struct ReductionProblem\n\nType that defines a Tikhonov-Fenichel reduction problem, i.e. a polynomial ODE system, for which all slow-fast separations of rates yielding a reduction onto dimension s are considered. \n\nFields\n\nf::Vector{QQMPolyRingElem}: RHS of ODE system as a vector of polynomials\nx::Vector{QQMPolyRingElem}: Vector of dynamic variables\np::Vector{QQMPolyRingElem}: Vector of all parameters\ns::Int: Dimension of reduced system\np_sf::Vector{QQMPolyRingElem}: Vector of parameters to be considered slow or fast (all others are considered fixed)\nidx_slow_fast::Vector{Bool}: Boolean index, such that p_sf=p[idx_slow_fast]\nJ::MatSpaceElem{QQMPolyRingElem}: Jacobian of f\n_f::Function: RHS of ODE system as a Julia function with arguments x and p\n\nThe type QQMPolyRingElem is used in Oscar.jl to represent elements of a polynomial ring; here this is ℝ[x,p].\n\n\n\n\n\n","category":"type"},{"location":"api/#TikhonovFenichelReductions.ReductionProblem-Tuple{Function, Vector{String}, Vector{String}, Int64}","page":"API Reference","title":"TikhonovFenichelReductions.ReductionProblem","text":"ReductionProblem(\n    f::Function,\n    x::Vector{String},\n    p::Vector{String},\n    s::Int64;\n    idx_slow_fast\n) -> ReductionProblem\n\n\nConstructor for ReductionProblem Type.\n\nArguments\n\nf(x,p)::Function: Julia function defining the RHS of system \nx::Vector{String}: Vector of dynamic variables \np::Vector{String}: Vector of all parameters\ns::Int: Dimension of reduced system \nidx_slow_fast::Vector{Bool}: Boolean index for all rates that are either small or large (all others are considered fixed)\n\nDescription\n\nThis function is used to set up the problem of finding Tikhonov-Fenichel Parameter Values for dimension s. The names of all variables and parameters in the system are parsed to appropriate types in Oscar.jl, so that the necessary conditions for the existence of such a reduction can be evaluated.\n\nSee also: tfpv_candidates\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.system_components-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.system_components","text":"system_components(\n    problem::ReductionProblem\n) -> Vector{Nemo.QQMPolyRingElem}\n\n\nConvenience function to get components of ODE system from instance of ReductionProblem. \n\nSee also: ReductionProblem, system_parameters\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.system_parameters-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.system_parameters","text":"system_parameters(\n    problem::ReductionProblem\n) -> Vector{Nemo.QQMPolyRingElem}\n\n\nConvenience function to get parameters of ODE system from instance of ReductionProblem. \n\nSee also: ReductionProblem, system_components\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.tfpv_candidates-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.tfpv_candidates","text":"tfpv_candidates(\n    problem::ReductionProblem\n) -> Tuple{Vector{Vector{Bool}}, Vector, Vector{Vector{Int64}}, Vector{Vector{Bool}}}\n\n\nFind all slow-fast separations π⁺ that are TFPVs by using the necessary conditions\n\nthe affine variety V(f0) contains an irreducible component Y of dimension s \nthe s-th coefficient of the characteristic polynomial of D₁f(x,π⁺) is non-zero for x∈Y\n\nDescription\n\nThe irreducible components are obtained by computing a minimal primary decomposition.  The Jacobian at a point in an irreducible component Y is constructed symbolically by computing normal forms with respect to a Gröbner basis G, s.t. V(G)=Y. \n\nTo obtain all general TFPVs and not just slow-fast separations, one can use the function tfpv_groebner_basis, which relies on computing a Gröbner basis with an elimination ordering for the components of the ODE system.\n\nSee also: tfpv_groebner_basis, print_results, print_tfpv, print_varieties\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.tfpv_groebner_basis-Tuple{ReductionProblem}","page":"API Reference","title":"TikhonovFenichelReductions.tfpv_groebner_basis","text":"tfpv_groebner_basis(\n    problem::ReductionProblem\n) -> Vector{Nemo.QQMPolyRingElem}\n\n\nUse the necessary conditions imposed by the RHS of the polynomial ODE System and its Jacobian to filter out TFPV candidates. All TFPVs must result in the vanishing of the returned set of polynomials.\n\nDescription\n\nIf π⁺ is a TFPV yielding a reduction onto an s-dimensional slow manifold, there exist a point x₀, such that \n\nf(x₀,π⁺)=0\nfor any k>s the determinants of all k×k minors of D₁f(x₀,π⁺) vanish\n\nThese properties can be used to filter out possible TFPV candidates.\n\nWe are interested in partial solutions of the system of polynomials defined by the conditions above. In particular, we only consider conditions on the parameters, since there might be multiple slow manifolds and reductions. Thus, we eliminate the dynamic variables from the ideal and obtain a set of polynomials whose variables are the parameters of the ODE system. This function computes a generating set for this elimination ideal and all TFPVs lie in its vanishing set.\n\nSee also: tfpv_candidates \n\n\n\n\n\n","category":"method"},{"location":"api/#Computing-a-Tikhonov-Fenichel-Reduction","page":"API Reference","title":"Computing a Tikhonov-Fenichel Reduction","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [TikhonovFenichelReductions]\nPages = [\"reduction.jl\"]\nPrivate = false\nOrder = [:type, :function]","category":"page"},{"location":"api/#TikhonovFenichelReductions.Reduction","page":"API Reference","title":"TikhonovFenichelReductions.Reduction","text":"mutable struct Reduction\n\nType that holds all information to compute a Tikhonov-Fenichel reduction for a given slow-fast separation of rates.\n\nFields\n\nsf_separation::Vector{Bool}: slow-fast separation (0: slow, 1: fast)\ns::Int: Dimension of reduced system (= dimension of slow manifold)\nR::QQMPolyRing: Ring over rationals in x and p\nx::Vector{QQMPolyRingElem}: Dynamic variables of system \np::Vector{QQMPolyRingElem}: All parameters\n_p::Vector{QQMPolyRingElem}: All parameters, where slow parameters are set to 0\np_sf::Vector{QQMPolyRingElem}: Parameters, that are considered to be either small or large (all others are considered fixed)\nidx_slow_fast::Vector{Bool}: Boolean indices, s.t. p_sf=p[idx_slow_fast]\nf::Vector{QQMPolyRingElem}: RHS of system as vector with elements of ring R\nf0::Vector{QQMPolyRingElem}: Fast / unperturbed part of system as vector with elements of ring R\nf1::Vector{QQMPolyRingElem}: Slow / perturbed part of system as vector with elements of ring R\nDf::MatSpaceElem{QQMPolyRingElem}: Jacobian of f\nDf_x0::MatSpaceElem{FracFieldElem{QQMPolyRingElem}}: Jacobian of f at non-singular point x0\nT::PolyRing{FracFieldElem{QQMPolyRingElem}}: Ring in x over Fraction field K\nchi::Poly{FracFieldElem{QQMPolyRingElem}}: Characteristic polynomial of Df_x0\nM::Vector{FracFieldElem{QQMPolyRingElem}}: Slow manifold defined in all components of system\nx0::Vector{FracFieldElem{QQMPolyRingElem}}: Non-singular point in the irreducible component of V(f0) containing the slow manifold\nK::FracField{QQMPolyRingElem}: Fraction field in p\nP::MatSpaceElem{FracFieldElem{QQMPolyRingElem}}: Matrix with rational functions, such that f0=P⋅Psi\nPsi::MatSpaceElem{FracFieldElem{QQMPolyRingElem}}: Vector with polynomials, such that f0=P⋅Psi\nDPsi::MatSpaceElem{FracFieldElem{QQMPolyRingElem}}: Jacobian of Psi\nsuccess::Vector{Bool}: Indicates whether slow manifold M, non-singular point x0 and product decomposition f0=P⋅Psi have been set successfully\n\n\n\n\n\n","category":"type"},{"location":"api/#TikhonovFenichelReductions.Reduction-Tuple{ReductionProblem, Vector{Bool}}","page":"API Reference","title":"TikhonovFenichelReductions.Reduction","text":"Reduction(\n    problem::ReductionProblem,\n    sf_separation::Vector{Bool};\n    s\n) -> Reduction\n\n\nConstructor for Reduction Type.\n\nArguments\n\nproblem: Reduction problem type holding information on system and dimension of reduction.\nsf_separation: Boolean index indicating slow-fast separation of rates (0: small, 1: large).\ns::Int: (optional) Dimension of slow manifold. Can be specified if a reduction corresponding to a TFPV for dimension different from problem.s should be considered (e.g. for manually computing a reduction for a given slow-fast separation that is not necessarily obtained via tfpv_candidates).\n\nSee also: set_manifold! set_decomposition!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.compute_reduction-Tuple{Reduction}","page":"API Reference","title":"TikhonovFenichelReductions.compute_reduction","text":"compute_reduction(\n    reduction::Reduction\n) -> Union{Nothing, Tuple{Vector{AbstractAlgebra.Generic.FracFieldElem{Nemo.QQMPolyRingElem}}, Union{Nothing, Vector}}}\n\n\nCompute the reduced system after the slow manifold, non-singular point and product decomposition have been set successfully.\n\nThe function returns a tuple containing the reduced system in raw form and with variables substituted according to the slow manifold.\n\nSee also: set_manifold!, set_decomposition!, set_point!, compute_bulk_reductions, Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.jacobian_tfpv_at_x0-Tuple{Reduction}","page":"API Reference","title":"TikhonovFenichelReductions.jacobian_tfpv_at_x0","text":"jacobian_tfpv_at_x0(\n    reduction::Reduction\n) -> AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{Nemo.QQMPolyRingElem}}\n\n\nReturn the Jacobian D₁f(x₀,π⁺) at the point x₀ on the slow manifold for a TFPV π⁺.\n\nSee also: Reduction, set_point!, set_manifold!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.jacobian_tfpv_on_manifold-Tuple{Reduction}","page":"API Reference","title":"TikhonovFenichelReductions.jacobian_tfpv_on_manifold","text":"jacobian_tfpv_on_manifold(\n    reduction::Reduction\n) -> AbstractAlgebra.Generic.MatSpaceElem{AbstractAlgebra.Generic.FracFieldElem{Nemo.QQMPolyRingElem}}\n\n\nReturn the Jacobian D₁f(x,π⁺) at a generic point x on the slow manifold for a TFPV π⁺.\n\nSee also: Reduction, set_manifold!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_decomposition!-Tuple{Reduction, AbstractAlgebra.Generic.MatSpaceElem, Any}","page":"API Reference","title":"TikhonovFenichelReductions.set_decomposition!","text":"set_decomposition!(\n    reduction::Reduction,\n    P::VecOrMat,\n    Psi\n) -> Bool\n\n\nSet product decomposition f0=P⋅Psi locally satisfying V(f0)=V(Psi), where P is a matrix of rational functions  and Psi is a vector of polynomials.\n\nSee also: set_manifold! set_point! Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_decomposition!-Tuple{Reduction, Any}","page":"API Reference","title":"TikhonovFenichelReductions.set_decomposition!","text":"set_decomposition!(reduction::Reduction, Psi) -> Bool\n\n\nTry to automatically compute matrix of rational functions P from given vector of polynomials Psi, such that f0=P⋅Psi and V(f0)=V(Psi) holds locally.\n\nNOTE: This works always if the drop in dimension r=n-s=1, but is experimental for r>1\n\nDescription\n\nTypically, Psi can be chosen from s independent entries of f0.  Practically one can consider the generators of the ideals defining the irreducible components of V(f0) as entries for Psi (possibly rewriting the rational equations as polynomials by multiplying appropriately with parameters occurring in a denominator).\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_decomposition!-Tuple{Reduction, VecOrMat, Any}","page":"API Reference","title":"TikhonovFenichelReductions.set_decomposition!","text":"set_decomposition!(\n    reduction::Reduction,\n    P::VecOrMat,\n    Psi\n) -> Bool\n\n\nSet product decomposition f0=P⋅Psi locally satisfying V(f0)=V(Psi), where P is a matrix of rational functions  and Psi is a vector of polynomials.\n\nSee also: set_manifold! set_point! Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_manifold!-Tuple{Reduction, AbstractVector}","page":"API Reference","title":"TikhonovFenichelReductions.set_manifold!","text":"set_manifold!(\n    reduction::Reduction,\n    M::AbstractVector\n) -> Bool\n\n\nSet the slow manifold by defining the values of the components of the system. Note that M must be defined as a vector with the same length as the system's components, i.e. reduction.x.\n\nSee also: Reduction, set_decomposition!, set_point!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.set_point!-Tuple{Reduction, AbstractVector}","page":"API Reference","title":"TikhonovFenichelReductions.set_point!","text":"set_point!(reduction::Reduction, x0::AbstractVector) -> Bool\n\n\nSet non-singular point on irreducible component of V(f0) corresponding to the slow manifold.  Typically, this can be done automatically by setting the slow manifold.\n\nSee also: set_manifold!, set_decomposition!, Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.slow_manifolds-Tuple{ReductionProblem, Vector{Bool}}","page":"API Reference","title":"TikhonovFenichelReductions.slow_manifolds","text":"slow_manifolds(\n    problem::ReductionProblem,\n    sf_separation::Vector{Bool}\n) -> Tuple{Any, Any}\n\n\nCompute the irreducible components of V(f0) and their dimensions for a given TFPV candidate.  If there exist a reduction, the corresponding slow manifold must be contained in one of these components.\n\nArguments\n\nproblem: Reduction problem type holding information on system and dimension of reduction.\nsf_separation: Boolean index indicating slow-fast separation of rates (0: small, 1: large).\n\nDescription\n\nThis function can be used if one wants to check whether a particular slow-fast separation of rates yields a reduction for any dimension. If the dimension of an irreducible component of V(f0) differs from what was defined with ReductionProblem, the constructor Reduction can be called with the additional argument s specifying the dimension.\n\nSee also: Reduction\n\n\n\n\n\n","category":"method"},{"location":"api/#Computing-Multiple-Tikhonov-Fenichel-Reductions-Simultaneously","page":"API Reference","title":"Computing Multiple Tikhonov-Fenichel Reductions Simultaneously","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"Modules = [TikhonovFenichelReductions]\nPages = [\"bulk_reductions.jl\"]\nPrivate = false\nOrder = [:type, :function]","category":"page"},{"location":"api/#TikhonovFenichelReductions.compute_bulk_reductions-Tuple{ReductionProblem, Vector{Vector{Bool}}, Union{UnitRange{Int64}, Vector{Int64}}, Any, VecOrMat}","page":"API Reference","title":"TikhonovFenichelReductions.compute_bulk_reductions","text":"compute_bulk_reductions(\n    problem::ReductionProblem,\n    sf_separation::Vector{Vector{Bool}},\n    idx::Union{UnitRange{Int64}, Vector{Int64}},\n    Psi,\n    M::VecOrMat;\n    idx_components\n) -> OrderedCollections.OrderedDict{Int64, Tuple{Reduction, Vector{AbstractAlgebra.Generic.FracFieldElem{Nemo.QQMPolyRingElem}}}}\n\n\nCompute reductions for TFPVs sf_separations[idx] onto slow manifold M.\n\nDescription\n\nPsi for the product decomposition f0=P⋅Psi and the slow manifold M depend on the irreducible component Y of V(f0).  Thus, for a particular choice of Y, we can compute all reduced systems for TFPVs for which Y is an irreducible component of V(f0) at once (the same choice for Psi and M works in all those cases). This function is essentially a convenience wrapper calling set_manifold!, set_decomposition! and compute_reduction to speed up the process of computing reduced systems onto the same slow manifold.\n\nAll possible choices of slow manifolds can be obtained with unique_slow_manifolds. To find all TFPVs that have slow manifolds in common use similar_reductions.\n\nSee also: unique_slow_manifolds, similar_reductions, compute_reduction, Reduction, set_manifold!, set_decomposition!\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.similar_reductions-Tuple{Vector{Vector{Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}}}, Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}}","page":"API Reference","title":"TikhonovFenichelReductions.similar_reductions","text":"similar_reductions(\n    V::Vector{Vector{Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}}},\n    Y::Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}\n) -> Vector{Int64}\n\n\nFind reductions onto the same slow manifold and return their numeric index.\n\nArguments\n\nV: Generators for the irreducible components of V(f0) for each slow-fast separation as returned by tfpv_candidates\nY: Generators for one irreducible component that corresponds to the slow manifold\n\nSee also: tfpv_candidates\n\n\n\n\n\n","category":"method"},{"location":"api/#TikhonovFenichelReductions.unique_slow_manifolds-Tuple{ReductionProblem, Vector{Vector{Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}}}, Vector{Vector{Int64}}}","page":"API Reference","title":"TikhonovFenichelReductions.unique_slow_manifolds","text":"unique_slow_manifolds(\n    problem::ReductionProblem,\n    V::Vector{Vector{Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}}},\n    dim_V::Vector{Vector{Int64}}\n) -> Any\n\n\nObtain all possible choices of slow manifolds with dimension s given V and dim_V as returned by tfpv_candidates.\n\nSee also: tfpv_candidates\n\n\n\n\n\n","category":"method"},{"location":"api/#Output","page":"API Reference","title":"Output","text":"","category":"section"},{"location":"api/","page":"API Reference","title":"API Reference","text":"print_results\nprint_tfpv\nprint_varieties","category":"page"},{"location":"api/#TikhonovFenichelReductions.print_results","page":"API Reference","title":"TikhonovFenichelReductions.print_results","text":"print_results(\n    problem::ReductionProblem,\n    sf_separations::Vector{Vector{Bool}},\n    V,\n    dim_V::Vector{Vector{Int64}};\n    idx\n)\n\n\nPrint slow-fast separations that are TFPVs and generators for the corresponding irreducible components of V(f0) together with their Krull dimension.\n\nArguments\n\nproblem: ReductionProblem \nsf_separations: Boolean indices defining all TFPVs π⁺ that are slow-fast separations (0: slow, 1: fast).\nV: Generators for the irreducible component of the affine varietiy V(f(⋅,π⁺)) for each slow-fast separation.\ndim_V: Krull dimensions of the ideals generated by the elements in V (this equals the dimension of V(f(⋅,π⁺)) in the affine space ℂⁿ or its real part, given that it contains a real non-singular point).\nidx: (optional) index vector to include only certain TFPVs (boolean or numeric)\n\nSee also: tfpv_candidates, print_tfpv, print_varieties\n\n\n\n\n\n","category":"function"},{"location":"api/#TikhonovFenichelReductions.print_tfpv","page":"API Reference","title":"TikhonovFenichelReductions.print_tfpv","text":"print_tfpv(\n    problem::ReductionProblem,\n    sf_separations::Vector{Vector{Bool}};\n    latex,\n    idx\n)\n\n\nPrint slow-fast separations to terminal or return LaTeXString that can be included in tex file. Optionally only print subset defined by (boolean or numeric) index set idx.\n\n\n\n\n\n","category":"function"},{"location":"api/#TikhonovFenichelReductions.print_varieties","page":"API Reference","title":"TikhonovFenichelReductions.print_varieties","text":"print_varieties(\n    V::Vector{Vector{Vector{AbstractAlgebra.Generic.MPoly{AbstractAlgebra.Generic.RationalFunctionFieldElem{Nemo.QQFieldElem, Nemo.QQMPolyRingElem}}}}},\n    dim_V::Vector{Vector{Int64}};\n    latex,\n    idx\n)\n\n\nPrint generators of ideals corresponding to the irreducible components of varieties V(f0) for TFPV candidates and their dimension (V and dim_V as returned by or tfpv_candidates). Use keyword argument latex=true to generate latex string instead.\n\nSee also: tfpv_candidates, print_tfpv, print_results\n\n\n\n\n\n","category":"function"},{"location":"#TikhonovFenichelReductions.jl","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"A Julia package for computing Tikhonov-Fenichel Parameter Values (TFPVs) for polynomial ODE systems and their corresponding reductions as described in [1–3].","category":"page"},{"location":"#Overview","page":"TikhonovFenichelReductions.jl","title":"Overview","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"The general framework for this package is singular perturbation theory. More precisely, we consider a system of ODEs in the form ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"beginsplit\ndotx = f(xpi varepsilon) = f^(0)(xpi) + varepsilon f^(1)(xpi) \n\nx(0)=x_0 x in UsubseteqmathbbR^n pi in Pi subseteq mathbbR^m\nendsplit","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"where f in mathbbRxpi is polynomial and varepsilon geq 0 is a small parameter.  The results from [1–3] allow us to compute a reduced system for varepsilon to 0 in the sense of Tikhonov [4] and Fenichel [5] using methods from commutative algebra and algebraic geometry. ","category":"page"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"TikhonovFenichelReductions.jl provides procedures for finding all possible TFPV candidates that yield a reduction in the sense of Tikhonov's theorem (see [6]) and functions to simplify the computation of the corresponding reduced systems. Note that this approach yields all possible timescale separations of rates and not just components as in the classical approach.","category":"page"},{"location":"#Finding-TFPV-candidates","page":"TikhonovFenichelReductions.jl","title":"Finding TFPV candidates","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"To find TFPV candidates admitting a reduced system of dimension s with TikhonovFenichelReductions.jl, one needs to create an instance of type ReductionProblem holding all relevant information.  Then, there are two different approaches briefly introduced as follows (see Getting Started for a practical discussion).","category":"page"},{"location":"#Slow-Fast-Separations","page":"TikhonovFenichelReductions.jl","title":"Slow-Fast Separations","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"We call a parameter vector, in which some components are set to zero (i.e. the small parameters), a slow-fast separation of rates.  Most TFPVs we are interested in are slow-fast separations, because they directly relate to a slow-fast separation of processes, but there might exist TFPVs that are characterized by rational expressions in the original parameters being small.  The approach for finding all slow-fast separations of rates is implemented in the function tfpv_candidates. Roughly speaking, this checks algorithmically for all possible slow-fast separations of rates if there exists an irreducible component of dimension s, since these correspond to the potential slow manifolds on which a reduction is defined. Additionally, we use a condition on the Jacobian of f with respect to x to filter out potential candidates.  Afterwards, it only remains to check whether the slow manifold can be given in closed form (explicitly) as a subset of mathbbR^n.  With this, one can then compute the reduced system.","category":"page"},{"location":"#All-TFPVs","page":"TikhonovFenichelReductions.jl","title":"All TFPVs","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"To get all possible TFPVs, we can consider necessary conditions concerning D_1 f, i.e. the Jacobian of f w.r.t. the components of the system. For this, we can compute a Gröbner basis G of an ideal in mathbbRpi (the elimination ideal of the ideal generated by f and all determinants of ktimes k minors of D_1f for ks).  Then, every TFPV must result in the vanishing of G. Thus, we may also obtain more complicated expressions in the parameters that are considered small. The Gröbner basis G can be computed by calling tfpv_groebner_basis.  Given a TFPV defined by rational expressions, one can rewrite the original system with a new parameter equal to this expression, which makes it a slow-fast separation of rates.  Then, the approach discussed above becomes applicable allowing us to compute the reduced system.","category":"page"},{"location":"#Dependencies","page":"TikhonovFenichelReductions.jl","title":"Dependencies","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"This packages only works due to the great Oscar.jl project.","category":"page"},{"location":"#License","page":"TikhonovFenichelReductions.jl","title":"License","text":"","category":"section"},{"location":"","page":"TikhonovFenichelReductions.jl","title":"TikhonovFenichelReductions.jl","text":"GNU GENERAL PUBLIC LICENSE, Version 3 or later (see LICENSE)","category":"page"}]
}
