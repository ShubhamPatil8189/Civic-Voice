import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './StoryMode.css';

const StoryMode = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  
  const [currentStory, setCurrentStory] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const categories = [
    { id: 'all', name: '✨ All Stories', nameHi: '✨ सभी कहानियां', nameMr: '✨ सर्व कथा', icon: '📚' },
    { id: 'scholarship', name: '🎓 Scholarships', nameHi: '🎓 छात्रवृत्तियां', nameMr: '🎓 शिष्यवृत्ती', icon: '📖' },
    { id: 'health', name: '🏥 Health', nameHi: '🏥 स्वास्थ्य', nameMr: '🏥 आरोग्य', icon: '❤️' },
    { id: 'widow', name: '👵 Widow Welfare', nameHi: '👵 विधवा कल्याण', nameMr: '👵 विधवा कल्याण', icon: '🌸' },
    { id: 'unemployment', name: '💼 Unemployment', nameHi: '💼 बेरोजगारी', nameMr: '💼 बेरोजगारी', icon: '🔧' },
    { id: 'farmer', name: '🌾 Farmers', nameHi: '🌾 किसान', nameMr: '🌾 शेतकरी', icon: '🚜' },
    { id: 'artisan', name: '🛠️ Artisans', nameHi: '🛠️ कारीगर', nameMr: '🛠️ कारागीर', icon: '⚒️' }
  ];

  // MOCK STORIES - Add this right here!
  const mockStories = [
    {
      _id: "1",
      heroName: "Priya",
      heroAge: 19,
      heroGender: "female",
      heroOccupation: "student",
      village: "Satara",
      category: "scholarship",
      problem: "Her father is a farmer with small land. She got admission in college but couldn't afford the fees of ₹25,000 per year.",
      action: "She applied for the Post-Matric Scholarship scheme. Her father got help from the village sarpanch to fill the form.",
      result: "She got full fee reimbursement of ₹25,000 and ₹5,000 for books. Now she's in second year, studying to become a teacher.",
      message: "Don't let money stop your dreams. This scheme exists for students like us.",
      likes: 89
    },
    {
      _id: "2",
      heroName: "Ramabai",
      heroAge: 62,
      heroGender: "female",
      heroOccupation: "retired laborer",
      village: "Osmanabad",
      category: "health",
      problem: "She had a heart condition and needed surgery costing ₹2 lakh. Her sons are daily wagers and couldn't afford it.",
      action: "A social worker told her about the Pradhan Mantri Jan Arogya Yojana (Ayushman Bharat). She got a golden card.",
      result: "Her entire surgery was covered under the scheme. She's now healthy and takes care of her grandchildren.",
      message: "Ayushman Bharat gave me a second chance at life. I thought I would die, but now I'm alive.",
      likes: 112
    },
    {
      _id: "3",
      heroName: "Gangubai",
      heroAge: 45,
      heroGender: "female",
      heroOccupation: "widow",
      village: "Solapur",
      category: "widow",
      problem: "Her husband died 3 years ago. She has two children and struggled to make ends meet by working as a laborer.",
      action: "She heard about the Sanjay Gandhi Niradhar Yojana from the Anganwadi worker. She applied for widow pension.",
      result: "She gets ₹900 per month pension. With this, she started a small papad making business at home.",
      message: "This pension gave me the courage to stand on my own feet. Now my children don't go hungry.",
      likes: 105
    },
    {
      _id: "4",
      heroName: "Vikas",
      heroAge: 24,
      heroGender: "male",
      heroOccupation: "unemployed youth",
      village: "Amravati",
      category: "unemployment",
      problem: "He completed ITI but couldn't find a job for 2 years. His family was struggling financially.",
      action: "He registered at the employment exchange and applied for a welding job under the Deen Dayal Upadhyaya Grameen Kaushalya Yojana.",
      result: "He got a job in a manufacturing company in Pune. Now earns ₹15,000 per month and supports his family.",
      message: "Unemployment made me feel worthless. This job gave me back my self-respect.",
      likes: 84
    },
    {
      _id: "5",
      heroName: "Babanrao",
      heroAge: 50,
      heroGender: "male",
      heroOccupation: "farmer",
      village: "Wardha",
      category: "farmer",
      problem: "He had 3 acres of land but no irrigation. Could only grow one crop a year and was in debt.",
      action: "He applied for a farm pond under the Pradhan Mantri Krishi Sinchayee Yojana.",
      result: "Got a farm pond with subsidy. Now can grow vegetables in summer too. Income doubled.",
      message: "Water is gold for farmers. This scheme gave me water and took away my debt.",
      likes: 115
    },
    {
      _id: "6",
      heroName: "Gangaram",
      heroAge: 65,
      heroGender: "male",
      heroOccupation: "potter",
      village: "Pandharpur",
      category: "artisan",
      problem: "His traditional pottery business was dying. No one buys earthen pots anymore.",
      action: "He joined a workshop under the Hunar Haat scheme and learned to make decorative pottery.",
      result: "Now sells decorative items at exhibitions and online. Earns ₹15,000 per month.",
      message: "I thought my family's 200-year-old craft would die with me. This scheme revived it.",
      likes: 93
    },
    {
      _id: "7",
      heroName: "Sitaram",
      heroAge: 45,
      heroGender: "male",
      heroOccupation: "farmer",
      village: "Beed",
      category: "health",
      problem: "He was diagnosed with kidney stones and needed surgery. As a small farmer, he had no savings.",
      action: "He registered for the Mahatma Phule Jan Arogya Yojana at the district hospital.",
      result: "Free surgery worth ₹80,000 was done. He's back to farming and even bought a buffalo.",
      message: "I was worried I'd have to sell my land for treatment. This scheme saved my land and my life.",
      likes: 87
    },
    {
      _id: "8",
      heroName: "Sunita",
      heroAge: 28,
      heroGender: "female",
      heroOccupation: "pregnant woman",
      village: "Parbhani",
      category: "health",
      problem: "She was pregnant with her first child but had severe anemia. Needed blood transfusion.",
      action: "ASHA worker enrolled her in Janani Suraksha Yojana.",
      result: "She delivered a healthy baby girl. Got ₹1,400 as cash assistance. Both are healthy.",
      message: "I was so scared for my baby. This scheme made sure we both survived.",
      likes: 103
    }
  ];

  useEffect(() => {
    fetchAllStories();
  }, []);

  const fetchAllStories = async () => {
    try {
      // Try to fetch from API first
      const response = await axios.get(
        `http://localhost:5000/api/stories/scheme/${schemeId}`
      );
      
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.data.length > 0) {
        setAllStories(response.data.data);
        const randomIndex = Math.floor(Math.random() * response.data.data.length);
        setCurrentStory(response.data.data[randomIndex]);
      } else {
        // If API returns no stories, use mock data
        console.log('Using mock stories');
        setAllStories(mockStories);
        const randomIndex = Math.floor(Math.random() * mockStories.length);
        setCurrentStory(mockStories[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      // If API fails, use mock data
      setAllStories(mockStories);
      const randomIndex = Math.floor(Math.random() * mockStories.length);
      setCurrentStory(mockStories[randomIndex]);
    } finally {
      setLoading(false);
    }
  };

  const getStoriesByCategory = (categoryId) => {
    if (categoryId === 'all') return allStories;
    return allStories.filter(story => story.category === categoryId);
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setShowDetailView(true);
  };

  const translations = {
    en: {
      title: "Real Stories, Real Lives Transformed",
      subtitle: "Meet ordinary people who achieved extraordinary things through government schemes",
      featured: "✨ Featured Story",
      explore: "Explore All Success Stories",
      categories: "Browse by Category",
      hearStory: "🔊 Hear Their Journey",
      stop: "⏹️ Stop",
      readMore: "Read Full Story",
      backToStories: "← Back to all stories",
      apply: "✅ I want to be the next success story",
      share: "Share this hope",
      liked: "❤️ Inspired",
      problem: "The Challenge",
      action: "The Step They Took",
      result: "The Beautiful Outcome",
      noStories: "Stories are being written...",
      beNext: "Be the next story!"
    },
    hi: {
      title: "असली कहानियां, असली जिंदगियां बदल गईं",
      subtitle: "साधारण लोगों से मिलिए जिन्होंने सरकारी योजनाओं के माध्यम से असाधारण हासिल किया",
      featured: "✨ खास कहानी",
      explore: "सभी सफलता की कहानियां देखें",
      categories: "श्रेणी के अनुसार देखें",
      hearStory: "🔊 उनकी यात्रा सुनें",
      stop: "⏹️ रोकें",
      readMore: "पूरी कहानी पढ़ें",
      backToStories: "← सभी कहानियों पर वापस",
      apply: "✅ मैं अगली सफलता की कहानी बनना चाहता हूं",
      share: "यह उम्मीद बांटें",
      liked: "❤️ प्रेरित हुआ",
      problem: "चुनौती",
      action: "उन्होंने यह कदम उठाया",
      result: "सुंदर परिणाम",
      noStories: "कहानियां लिखी जा रही हैं...",
      beNext: "अगली कहानी बनें!"
    },
    mr: {
      title: "वास्तविक कथा, वास्तविक आयुष्य बदलले",
      subtitle: "सामान्य लोक भेटा ज्यांनी सरकारी योजनांद्वारे असाधारण गाठले",
      featured: "✨ खास कथा",
      explore: "सर्व यशोगाथा एक्सप्लोर करा",
      categories: "श्रेणीनुसार ब्राउझ करा",
      hearStory: "🔊 त्यांचा प्रवास ऐका",
      stop: "⏹️ थांबवा",
      readMore: "संपूर्ण कथा वाचा",
      backToStories: "← सर्व कथांवर परत",
      apply: "✅ मला पुढची यशोगाथा बनायचे आहे",
      share: "ही आशा शेअर करा",
      liked: "❤️ प्रेरित झालो",
      problem: "आव्हान",
      action: "त्यांनी हे पाऊल उचलले",
      result: "सुंदर परिणाम",
      noStories: "कथा लिहिल्या जात आहेत...",
      beNext: "पुढची कथा व्हा!"
    }
  };

  const t = translations[language];

 const speakStory = (story) => {
  if (!window.speechSynthesis) {
    alert('Your browser does not support text-to-speech');
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  let storyText = '';
  let langCode = '';

  if (language === 'en') {
    storyText = `Meet ${story.heroName}. ${story.heroName} is a ${story.heroOccupation} from ${story.village}. 
      They faced a challenge: ${story.problem}. 
      They took a brave step: ${story.action}. 
      And today? ${story.result}. 
      ${story.heroName} says: "${story.message}" 
      If they can do it, so can you.`;
    langCode = 'en-US';
  } 
  else if (language === 'hi') {
    storyText = `मिलिए ${story.heroNameHi || story.heroName} से। वे ${story.villageHi || story.village} के रहने वाले हैं। 
      उनके सामने एक कठिन चुनौती थी: ${story.problemHi || story.problem}. 
      उन्होंने यह कदम उठाया: ${story.actionHi || story.action}. 
      और आज? ${story.resultHi || story.result}. 
      ${story.heroNameHi || story.heroName} कहते हैं: "${story.messageHi || story.message}" 
      अगर वे कर सकते हैं, तो आप भी कर सकते हैं।`;
    langCode = 'hi-IN';
  } 
  else if (language === 'mr') {
    // FORCE Marathi text - NO FALLBACK TO ENGLISH!
    storyText = `भेटा ${story.heroNameMr || story.heroName} ला. ${story.heroNameMr || story.heroName} ${story.villageMr || story.village} चे रहिवासी आहेत. 
      त्यांच्यापुढे एक कठीण आव्हान होते: ${story.problemMr || story.problem}. 
      त्यांनी हे पाऊल उचलले: ${story.actionMr || story.action}. 
      आणि आजचा परिणाम? ${story.resultMr || story.result}. 
      ${story.heroNameMr || story.heroName} म्हणतात: "${story.messageMr || story.message}" 
      जर ते करू शकतात, तर तुम्ही सुद्धा करू शकता.`;
    langCode = 'mr-IN';
  }

  console.log('Speaking in:', language, 'Text:', storyText.substring(0, 50)); // Debug

  const utterance = new SpeechSynthesisUtterance(storyText);
  utterance.lang = langCode;
  utterance.rate = 0.9;

  // Force wait for voices to load
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => v.lang)); // Debug
    
    // Try to find exact Marathi voice
    let selectedVoice = voices.find(voice => voice.lang === 'mr-IN');
    
    // If not found, try any voice containing 'mr' or 'hi' for Marathi
    if (!selectedVoice && language === 'mr') {
      selectedVoice = voices.find(voice => voice.lang.includes('mr') || voice.lang.includes('hi'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Selected voice:', selectedVoice.lang);
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle voices loaded event
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
  } else {
    setVoice();
  }

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = (event) => {
    console.error('Speech error:', event);
    setIsSpeaking(false);
    // Fallback to Hindi voice if Marathi fails
    if (language === 'mr') {
      console.log('Marathi failed, falling back to Hindi');
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };
};
  if (loading) {
    return (
      <div className="story-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading inspiring stories...</p>
      </div>
    );
  }

  if (showDetailView && selectedStory) {
    return (
      <div className="detail-container">
        <button onClick={() => setShowDetailView(false)} className="back-button">
          ← {t.backToStories}
        </button>

        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-avatar">
              {selectedStory.heroGender === 'female' ? '👩' : '👨'}
            </div>
            <div className="detail-title">
              <h1 className="detail-name">
                {selectedStory.heroName}
              </h1>
              <p className="detail-meta">
                {selectedStory.heroAge} years • {selectedStory.village}
              </p>
            </div>
          </div>

          <div className="detail-journey">
            <div className="journey-item problem">
              <div className="journey-icon">😟</div>
              <div className="journey-content">
                <h3>{t.problem}</h3>
                <p>{selectedStory.problem}</p>
              </div>
            </div>

            <div className="journey-arrow">↓</div>

            <div className="journey-item action">
              <div className="journey-icon">💪</div>
              <div className="journey-content">
                <h3>{t.action}</h3>
                <p>{selectedStory.action}</p>
              </div>
            </div>

            <div className="journey-arrow">↓</div>

            <div className="journey-item result">
              <div className="journey-icon">🎉</div>
              <div className="journey-content">
                <h3>{t.result}</h3>
                <p>{selectedStory.result}</p>
              </div>
            </div>
          </div>

          {/* Transformation Journey - NEW CLEAN VERSION */}
          <div className="transformation-journey">
            <div className="journey-compare">
              {/* Before Card */}
              <div className="compare-card before">
                <div className="card-label before-label">BEFORE</div>
                <div className="card-emojis">
                  <span className="main-emoji">😟</span>
                  <span className="state-emoji">😢</span>
                </div>
                <p className="card-quote">"I had lost all hope"</p>
              </div>

              {/* Arrow Divider */}
              <div className="journey-arrow-divider">
                <span className="arrow-line"></span>
                <span className="arrow-icon">→</span>
                <span className="arrow-line"></span>
              </div>

              {/* After Card */}
              <div className="compare-card after">
                <div className="card-label after-label">AFTER</div>
                <div className="card-emojis">
                  <span className="main-emoji">✨</span>
                  <span className="state-emoji">🥳</span>
                </div>
                <p className="card-quote">"Now I have a new life!"</p>
              </div>
            </div>
          </div>

          {/* Voice & Impact Section */}
          <div className="voice-impact-section">
            {/* Voice Note Player */}
            <div className="voice-player" onClick={() => speakStory(selectedStory)}>
              <div className="voice-icon">🎤</div>
              <div className="voice-info">
                <span className="voice-label">Hear {selectedStory.heroName}'s story</span>
                <div className="voice-wave">
                  <span className="wave"></span>
                  <span className="wave"></span>
                  <span className="wave"></span>
                  <span className="wave"></span>
                  <span className="wave"></span>
                </div>
              </div>
              <span className="voice-duration">1:24</span>
            </div>

            {/* Impact Stats */}
            <div className="impact-stats">
              <div className="stat-number">1,247</div>
              <div className="stat-text">
                <span>people like {selectedStory.heroName}</span>
                <span className="stat-subtext">have transformed their lives</span>
              </div>
            </div>
          </div>

          {/* Share Section */}
         

          <div className="message-box">
            <div className="quote-mark">"</div>
            <p className="hero-message">
              {selectedStory.message}
            </p>
            <div className="quote-mark closing">"</div>
          </div>

          <div className="detail-actions">
            <button 
              className={`action-btn speak-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={() => isSpeaking ? stopSpeaking() : speakStory(selectedStory)}
            >
              {isSpeaking ? t.stop : t.hearStory}
            </button>
            <button className="action-btn apply-btn" onClick={() => navigate('/schemes')}>
              {t.apply}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-container">
      <div className="language-bar">
        <button 
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          🇬🇧 English
        </button>
        <button 
          className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
          onClick={() => setLanguage('hi')}
        >
          🇮🇳 हिंदी
        </button>
        <button 
          className={`lang-btn ${language === 'mr' ? 'active' : ''}`}
          onClick={() => setLanguage('mr')}
        >
          🇮🇳 मराठी
        </button>
      </div>

      <div className="hero-section">
        <h1 className="hero-title">{t.title}</h1>
        <p className="hero-subtitle">{t.subtitle}</p>
        <div className="hero-illustration">
          <span className="hero-emoji">🌟</span>
          <span className="hero-emoji">✨</span>
          <span className="hero-emoji">💫</span>
        </div>
      </div>

      {currentStory && (
        <div className="featured-card" onClick={() => handleStoryClick(currentStory)}>
          <div className="featured-badge">{t.featured}</div>
          <div className="featured-content">
            <div className="featured-avatar">
              {currentStory.heroGender === 'female' ? '👩' : '👨'}
            </div>
            <div className="featured-info">
              <h2 className="featured-name">
                {currentStory.heroName}
              </h2>
              <p className="featured-meta">
                {currentStory.heroAge} years • {currentStory.village}
              </p>
              <p className="featured-preview">
                {currentStory.problem?.substring(0, 100)}...
              </p>
              <span className="read-more">{t.readMore} →</span>
            </div>
          </div>
        </div>
      )}

      <div className="categories-section">
        <h2 className="section-title">{t.categories}</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">
                {language === 'en' ? cat.name : language === 'hi' ? cat.nameHi : cat.nameMr}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="stories-section">
        <h2 className="section-title">{t.explore}</h2>
        <div className="stories-grid">
          {getStoriesByCategory(activeCategory).map(story => (
            <div key={story._id} className="story-card" onClick={() => handleStoryClick(story)}>
              <div className="story-card-header">
                <div className="story-avatar">
                  {story.heroGender === 'female' ? '👩' : '👨'}
                </div>
                <div className="story-card-info">
                  <h3 className="story-card-name">{story.heroName}</h3>
                  <p className="story-card-meta">{story.heroAge} years</p>
                </div>
              </div>
              <p className="story-card-preview">
                {story.problem?.substring(0, 80)}...
              </p>
              <div className="story-card-footer">
                <span className="like-count">❤️ {story.likes || 0}</span>
                <span className="read-more-link">{t.readMore} →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-banner">
        <div className="cta-content">
          <h2 className="cta-title">{t.beNext}</h2>
          <p className="cta-text">Thousands like you have transformed their lives. You can too.</p>
          <button className="cta-button" onClick={() => navigate('/schemes')}>
            {t.apply}
          </button>
        </div>
        <div className="cta-illustration">
          <span className="cta-emoji">✨</span>
          <span className="cta-emoji">🚀</span>
          <span className="cta-emoji">🌟</span>
        </div>
      </div>
    </div>
  );
};

export default StoryMode;