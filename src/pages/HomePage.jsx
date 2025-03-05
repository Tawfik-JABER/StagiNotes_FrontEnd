import React, { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import KeyboardDoubleArrowUpOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowUpOutlined";

import { Linkedin, Twitter, Instagram, Facebook, Youtube } from "lucide-react";

import "../styles/homePage.css";

import slide01 from "../images/ofpptBuilding01.png";
import slide02 from "../images/ofpptBuilding02.png";
import slide03 from "../images/ofpptBuilding03.png";
import director from "../images/director.png";
import stagiaire from "../images/students.png";
import tutteur from "../images/tutteur.png";
import formateur from "../images/formatteur.jpeg";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [inView, setInView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const imageSlider = [
    { id: 0, image: slide01 },
    { id: 1, image: slide02 },
    { id: 2, image: slide03 },
  ];
  const cards = [
    {
      id: 1,
      title: "Espace Formateur",
      image: formateur,
      link: "/formatteur/login",
    },
    {
      id: 2,
      title: "Espace Stagiaire",
      image: stagiaire,
      link: "/stagiaire/login",
    },
    {
      id: 3,
      title: "Espace Director",
      image: director,
      link: "/director/login",
    },
    {
      id: 4,
      title: "Espace Tutteur",
      image: tutteur,
      link: "/tutteur/login",
    },
  ];

  // Scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The Navbar fixed scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle automatic slide transition
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlider.length);
    }, 5000);

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);

  // Handle manual slide change
  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset the interval when manually changing imageSlider
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % imageSlider.length);
      }, 5000);
    }
  };

  // Use IntersectionObserver to detect when the statistics section is in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setInView(true); // Start animation when the section is in view
      }
    });

    const statsSection = document.querySelector(".stat-number");
    if (statsSection) observer.observe(statsSection);

    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="home-page">
        {/* Navigation Bar */}
        <nav className={`navbare ${isSticky ? "sticky-navbar" : ""}`}>
          <div className="logo">
            <h1>
              <span className="logo-stagi">Stagi</span>
              <span className="logo-notes">Notes</span>
            </h1>
          </div>

          <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
            <a href="/" className="navLink">
              Accueil
            </a>
            <a href="#About" className="navLink">
              A propos
            </a>
            <a href="#Contact" className="navLink">
              Contact
            </a>

            <div className="mobile-login-selector">
              <a href="#Account">Se Connecter</a>
            </div>
          </div>

          <div className="login desktop-login">
            <a href="#Account">Se Connecter</a>
          </div>

          <div className="hamburger" onClick={toggleMobileMenu}>
            <span className={`bar ${isMobileMenuOpen ? "active" : ""}`}></span>
            <span className={`bar ${isMobileMenuOpen ? "active" : ""}`}></span>
            <span className={`bar ${isMobileMenuOpen ? "active" : ""}`}></span>
          </div>
        </nav>

        <div className={`upward-arrow ${isSticky ? "show-arrow" : ""}`} onClick={scrollToTop}>
          <KeyboardDoubleArrowUpOutlinedIcon sx={{ fontSize: "inherit" }} />
        </div>

        {/* Hero Section with Carousel */}
        <section className="hero">
          <div className="carousel">
            {imageSlider.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${
                  index === currentSlide ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-content">
                  <h1 className="hero-title">
                    Gestion Des Résultats Des Examens
                  </h1>
                  <h1 className="hero-title">Pour L'ofppt Et Stagiaires</h1>
                  <p className="hero-subtitle">
                    Maintenant, vous pouvez voir vos résultats et gérer votre
                    tableau de bord facilement avec StagiNotes.
                  </p>
                  <a href="#Account" className="connect-button">
                    Commencer
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="pagination-dots">
            {imageSlider.map((slide, index) => (
              <span
                key={slide.id}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="statistics">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <i className="fas fa-user-tie"></i>
              </div>
            </div>
            <h2 className="stat-number">
              {inView ? (
                <CountUp start={0} end={10000} duration={3} separator="," />
              ) : (
                "0"
              )}
            </h2>
            <p className="stat-label">Formateurs</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
            </div>
            <h2 className="stat-number">
              {inView ? (
                <CountUp start={0} end={900000} duration={3} separator="," />
              ) : (
                "0"
              )}
            </h2>
            <p className="stat-label">Stagiaires</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <i className="fas fa-building"></i>
              </div>
            </div>
            <h2 className="stat-number">
              {inView ? <CountUp start={0} end={400} duration={3} /> : "0"}
            </h2>
            <p className="stat-label">Etablissements</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
            </div>
            <h2 className="stat-number">
              {inView ? <CountUp start={0} end={113} duration={3} /> : "0"}
            </h2>
            <p className="stat-label">Localité</p>
          </div>
        </section>

        {/* Welcome Section */}
        <section id="About" className="welcome-container">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1 className="welcome-heading">
                <span className="welcome-highlight">BIENVENUE DANS</span> DANS
                STAGINOTES
              </h1>
              <p className="welcome-paragraph">
                Le navire s'est échoué sur le rivage de cette île déserte
                inexplorée avec Gilligan le Skipper aussi le millionnaire et sa
                femme. Ces jours sont tous Heureux et Libres. Ces jours sont
                tous les partager avec moi. Le navire s'est échoué sur le rivage
                de cette île déserte inexplorée avec Gilligan le Skipper aussi
                le millionnaire et sa femme. Ces jours sont tous Heureux et
                Libres. Ces jours sont tous les partager avec moi.
              </p>
              <p className="welcome-paragraph">
                Il est temps de se maquiller. Il est temps de bien s'habiller.
                Il est temps de lever le rideau sur le Muppet Show ce soir. Il
                est temps de se maquiller. Il est temps de bien s'habiller. Il
                est temps de lever le rideau sur le Muppet Show ce soir.
              </p>
            </div>
            <div className="mockup"></div>
          </div>
        </section>

        {/* Account Section */}
        <section id="Account" className="account-container">
          <h1 className="section-title">ACCÉDEZ À VOTRE COMPTE</h1>
          <p className="section-subtitle">
            Le navire s'est échoué sur le rivage de cette île déserte
            inexplorée.
          </p>
          <div className="divider"></div>
          <div className="cartes-container">
            {cards.map((card) => (
              <div className="carte" key={card.id}>
                <a href={card.link} className="carte-link">
                  <div className="carte-image-container">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="carte-image"
                    />
                  </div>
                  <div className="carte-title">{card.title}</div>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Reclamation Section */}
        <section id="Contact" className="reclamation-container">
          <h1 className="reclamation-heading">RECLAMATION AND QUESTION</h1>
          <p className="reclamation-subtitle">
            Le navire s'est échoué sur le rivage de cette île déserte
            inexplorée.
          </p>
          <div className="divider"></div>

          <div className="reclamation-content">
            <form className="form-section">
              <div className="form-group">
                <label htmlFor="object">Objet :</label>
                <input
                  required
                  type="text"
                  id="object"
                  placeholder="Problem de suivi les notes ..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reclamation">Reclamation :</label>
                <textarea
                  required
                  id="reclamation"
                  placeholder="expliquer bien votre problem ..."
                  className="form-textarea"
                  rows={6}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail :</label>
                <input
                  required
                  type="email"
                  id="email"
                  placeholder="example@ofppt.ma"
                  className="form-input"
                />
              </div>

              <button type="submit" className="submit-button">
                Soumettre
              </button>
            </form>

            <div className="contact-section">
              <h2 className="contact-heading">Contactez-nous</h2>

              <div className="contact-button">
                <LocalPhoneIcon size={20} />
                <span className="phone-numbers">
                  +212 8 03 76 94 33 <span className="separator">|</span> +212 9
                  24 71 28 18
                </span>
              </div>

              <div className="contact-button">
                <MarkunreadIcon size={20} />
                <span>mailSupportofppt@staginotes.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="footer-container">
          <div className="footer-section brand-section">
            <h2 className="brand-name">
              Stagi<span className="notes-highlight">Notes</span>
            </h2>
            <p className="brand-description">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
              maxime porro earum, mollitia explicabo cum sunt harum omnis quidem
              repellendus saepe nam corrupti corporis veritatis eaque
              consequuntur que enim accusantium.
            </p>
            <p className="copyright">
              Copyright © 2025 StagiNotes - All rights reserved.
            </p>
          </div>

          <div className="footer-section links-section">
            <h3 className="section-title" style={{ textAlign: "start" }}>
              STAGINOTES
            </h3>
            <nav className="footer-nav">
              <ul>
                <li>
                  <a href="/" className="footer-link">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#About" className="footer-link">
                    A propos
                  </a>
                </li>
                <li>
                  <a href="#Contact" className="footer-link">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#Account" className="footer-link">
                    Commencer
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="footer-section social-section">
            <h3 className="section-title" style={{ textAlign: "start" }}>
              RÉSEAU SOCIAL
            </h3>
            <div className="social-icons">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.linkedin.com/company/ofpptpageofficielle/"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/OFPPT_Officiel"
                className="social-icon"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/ofppt.officiel/"
                className="social-icon"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/ofppt.page.officielle/"
                className="social-icon"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.youtube.com/c/ofpptchaineofficielle"
                className="social-icon"
                aria-label="YouTube"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
