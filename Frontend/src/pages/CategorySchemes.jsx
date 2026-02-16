import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ArrowLeft, ExternalLink, Loader2, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const CategorySchemes = () => {
    const { categoryName } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(50);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                if (limit === 50) setLoading(true);
                // Fetch schemes filtered by category with limit
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
                const response = await axios.get(
                    `${backendUrl}/api/scheme?category=${encodeURIComponent(categoryName)}&language=${i18n.language}&limit=${limit}`
                );

                // Ensure schemes is always an array
                const data = response.data;
                let fetchedSchemes = [];
                if (Array.isArray(data)) {
                    fetchedSchemes = data;
                } else if (data && Array.isArray(data.schemes)) {
                    fetchedSchemes = data.schemes;
                }

                setSchemes(fetchedSchemes);
                // If we got fewer schemes than the limit, we've reached the end
                if (fetchedSchemes.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } catch (err) {
                console.error("Error fetching schemes:", err);
                setError("Failed to load schemes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryName) {
            fetchSchemes();
        }
    }, [categoryName, i18n.language, limit]);

    const handleShowMore = () => {
        if (limit < 125) {
            setLimit(prev => prev + 25);
        }
    };

    // Decode category name for display (e.g., "Social%20Welfare" -> "Social Welfare")
    const displayCategory = decodeURIComponent(categoryName || "Category");

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
                <div className="container mx-auto max-w-7xl">

                    {/* Header Section with Gradient */}
                    <div className="relative mb-12 rounded-3xl overflow-hidden p-8 md:p-12 text-center md:text-left">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                            <div>
                                <Button
                                    variant="ghost"
                                    className="mb-4 text-white/80 hover:text-white hover:bg-white/10 -ml-2"
                                    onClick={() => navigate(-1)}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                                    {displayCategory} Schemes
                                </h1>
                                <p className="text-blue-100 text-lg max-w-2xl">
                                    Found {schemes.length} schemes and benefits under {displayCategory}.
                                </p>
                            </div>
                            {/* Decorative Icon or Illustration could go here */}
                            <div className="hidden md:block opacity-20 transform rotate-12">
                                {/* Placeholder for large icon */}
                                <ExternalLink className="h-32 w-32" />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Finding matching schemes...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
                            <p>{error}</p>
                            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                        </div>
                    ) : schemes.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ArrowRight className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Schemes Found</h3>
                            <p className="text-muted-foreground mb-6">
                                We couldn't find any active schemes under "{displayCategory}" at the moment.
                            </p>
                            <Button onClick={() => navigate('/schemes')}>View All Schemes</Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {schemes.map((scheme) => {
                                    // Localized fields
                                    const name = scheme[`name_${i18n.language}`] || scheme.name_en || scheme.name;
                                    const desc = scheme[`description_${i18n.language}`] || scheme.description_en || scheme.description;
                                    const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

                                    return (
                                        <div key={scheme._id} className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                                            {/* Card Header Gradient Line */}
                                            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                                            <div className="p-6 flex-grow flex flex-col">
                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                                        {scheme.level || "Central"}
                                                    </span>
                                                    {scheme.category && (
                                                        <span className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                                                            {scheme.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                    {name}
                                                </h3>

                                                <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                                                    {truncate(desc || "Click to view more details about this scheme.", 120)}
                                                </p>

                                                <div className="mt-auto">
                                                    <Link to={`/eligibility/${scheme._id}`}>
                                                        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg group-hover:translate-y-[-2px]">
                                                            View Information
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Show More / Limit Suggestions */}
                            <div className="mt-12 flex flex-col items-center gap-6">
                                {limit < 125 && hasMore ? (
                                    <Button
                                        onClick={handleShowMore}
                                        variant="outline"
                                        className="px-8 py-6 rounded-xl border-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 font-semibold transition-colors"
                                    >
                                        Show More Schemes
                                    </Button>
                                ) : schemes.length > 0 ? (
                                    <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl max-w-2xl text-center shadow-sm">
                                        <h4 className="text-indigo-900 font-bold text-xl mb-3">Looking for something specific?</h4>
                                        <p className="text-indigo-700 mb-6">
                                            I've shown the most relevant schemes for {displayCategory}.
                                            For more personalized suggestions, try our **Smart Voice Assistant**!
                                        </p>
                                        <Link to="/voice-assistant">
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                                Talk to Voice Assistant
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        </>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategorySchemes;
