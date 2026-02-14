import { Link } from "react-router-dom";
import { Search, MessageCircle, Phone, Mail, Zap, BookOpen, AlertCircle, Home, Sparkles, RefreshCw, CheckCircle, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const BACKEND_URL = "http://localhost:5000";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch FAQs from Backend with pagination
  const fetchFAQs = async (page = 1, reset = false) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const limit = page === 1 ? 4 : 2; // First load: 4, subsequent: 2
      const res = await fetch(`${BACKEND_URL}/api/faqs?page=${page}&limit=${limit}`);
      const data = await res.json();

      if (reset || page === 1) {
        setFaqs(data.faqs || []);
      } else {
        setFaqs(prev => [...prev, ...(data.faqs || [])]);
      }

      setHasMore(data.pagination?.hasMore || false);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFAQs(1);
  }, []);

  // Handle Show More button click
  const handleShowMore = () => {
    if (hasMore && !loadingMore) {
      fetchFAQs(currentPage + 1);
    }
  };

  // Trigger Smart FAQ Generation
  const handleGenerateFAQs = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/faqs/generate`, {
        method: "POST"
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchFAQs(1, true); // Reset to page 1
      } else {
        toast.info(data.message || "No new FAQs generated");
      }
    } catch (err) {
      console.error("Error generating FAQs:", err);
      toast.error("Failed to generate FAQs");
    } finally {
      setGenerating(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="landing" />

      <style>{`
        .hero-blob { position:absolute; inset:0; background: radial-gradient(800px 400px at 10% 10%, rgba(124,58,237,0.08), transparent 20%), radial-gradient(600px 300px at 90% 80%, rgba(6,182,212,0.06), transparent 18%); pointer-events:none; }
        .glass-hero { border-radius: 1rem; padding: 2.25rem; background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94)); box-shadow: 0 24px 60px rgba(2,6,23,0.06); }
        .search-input { background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95)); border-radius: 999px; padding: .8rem 1.2rem; box-shadow: 0 8px 24px rgba(2,6,23,0.05); border: 1px solid rgba(2,6,23,0.04); }
        .faq-item { background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92)); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 6px 18px rgba(2,6,23,0.04); transition: all .3s; }
        .faq-item:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(2,6,23,0.08); }
        .show-more-btn { 
          background: white; 
          color: #6366f1; 
          border: 2px solid #e0e7ff; 
          border-radius: 0.5rem; 
          padding: 0.75rem 1.75rem; 
          font-weight: 600; 
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .show-more-btn:hover:not(:disabled) { 
          background: #f5f7ff;
          border-color: #c7d2fe;
          transform: translateY(-1px);
        }
        .show-more-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <main className="container mx-auto px-4 py-16 relative flex-1">
        <div className="hero-blob" />

        <section className="max-w-3xl mx-auto mb-12">
          <div className="glass-hero text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers, troubleshoot issues, or get in touch with our team.
            </p>

            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs (e.g., 'eligibility', 'language', 'mobile')..."
                className="search-input w-full pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 px-4">
            <h2 className="text-2xl font-semibold text-center sm:text-left">Frequently Asked Questions</h2>
            <Button
              onClick={handleGenerateFAQs}
              disabled={generating}
              variant="outline"
              className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-purple-600" />
              )}
              {generating ? "Learning..." : "Smart Update"}
            </Button>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                <p className="text-muted-foreground">Loading answers...</p>
              </div>
            ) : filteredFaqs.length > 0 ? (
              <>
                {filteredFaqs.map((faq, i) => (
                  <details key={faq._id || i} className="faq-item group cursor-pointer">
                    <summary className="flex items-start gap-4 outline-none select-none">
                      <div className="flex flex-col items-center gap-2 mt-1">
                        <div className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                          {faq.category}
                        </div>
                        {faq.isAutoGenerated && (
                          <div className="text-[10px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles className="h-2 w-2" />
                            New
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-open:text-primary transition-colors text-left pt-1">{faq.question}</h3>
                      </div>
                    </summary>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed pl-2">{faq.answer}</p>
                  </details>
                ))}

                {/* Show More Button - only show if less than 7 FAQs and more available */}
                {!searchTerm && hasMore && faqs.length < 7 && (
                  <div className="py-8 text-center">
                    <button
                      onClick={handleShowMore}
                      disabled={loadingMore}
                      className="show-more-btn inline-flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Show More</span>
                          <ChevronDown className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* No More FAQs Message - show when 7 or more FAQs loaded OR no more available */}
                {!searchTerm && (faqs.length >= 7 || (!hasMore && faqs.length > 4)) && (
                  <div className="py-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-3 rounded-full border border-purple-100">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">You've reached the end - all FAQs loaded!</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No FAQs match your search. Try different keywords.</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/voice-assistant" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Voice Assistant</div>
              <div className="text-xs text-muted-foreground">Ask in your language</div>
            </Link>

            <Link to="/schemes" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <BookOpen className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Browse Schemes</div>
              <div className="text-xs text-muted-foreground">Explore by category</div>
            </Link>

            <Link to="/eligibility" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <AlertCircle className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Check Eligibility</div>
              <div className="text-xs text-muted-foreground">Get instant answers</div>
            </Link>

            <Link to="/" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <Home className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Home</div>
              <div className="text-xs text-muted-foreground">Back to start</div>
            </Link>
          </div>
        </section>

        <section className="py-8 bg-secondary/5 rounded-xl p-6">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">Our support team is here to assist. Reach out via phone, email or chat anytime.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild><a href="tel:1800-SCHEMES">Call Now</a></Button>
              <Button variant="outline" asChild><a href="mailto:help@civicvoice.gov">Send Email</a></Button>
            </div>
          </div>
        </section>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Help;
