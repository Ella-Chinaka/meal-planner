import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1>Quick Diet</h1>
          <p className="hero-tagline">
            Eat smart, stay healthy, and save time with personalized Nigerian meal plans.
          </p>
          <div className="input-section">
            {user ? (
              <>
                <Link to="/planner" className="btn">Plan my meals</Link>
                <Link to="/dashboard" className="btn btn-light">Go to dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn">Get started, it's free</Link>
                <Link to="/login" className="btn btn-light">Log in</Link>
              </>
            )}
          </div>
          <p className="hero-browse">
            or <Link to="/meals">browse all meals</Link>
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className="about-section">
        <img src="/images/jollofrice.jpg" alt="Jollof rice and chicken" />
        <div>
          <h2>About Quick Diet</h2>
          <p>
            Quick Diet is more than just a meal planner, it is your everyday nutrition partner.
            By combining technology with local Nigerian delicacies, it ensures that your health goals
            align with meals you actually enjoy. Instead of struggling with foreign diets that don’t fit
            your lifestyle, Quick Diet creates practical, affordable, and balanced plans tailored to you.
            With calorie based scaling, you never have to guess portions again. Plus, the automatic weekly
            shopping list saves time, reduces food waste, and helps you stick to your budget.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Quick Diet?</h2>
        <div className="card-grid">
          <div className="card">
            <img src="/images/egusi&poundedyam.jpg" alt="Personalized Plans" />
            <h3>Personalized Plans</h3>
            <p>
              Tell us your age, weight, activity level and goal and we work out your daily calorie
              target for you. Plans respect your diet and allergies, and you can swap any meal
              you don’t fancy with one click.
            </p>
          </div>
          <div className="card">
            <img src="/images/beans&plantain.jpg" alt="Shopping List" />
            <h3>Smart Shopping List</h3>
            <p>
              Your week’s ingredients grouped by market section. Tick items off as you buy them,
              and send the list to yourself or a family member on WhatsApp in one tap.
            </p>
          </div>
          <div className="card">
            <img src="/images/fish-pepper.jpg" alt="Track Progress" />
            <h3>Stay on Track</h3>
            <p>
              Save your plans, tick off meals as you eat them to build a streak, and log your
              weight to watch your progress on a chart over the weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Elina" />
            <p>“Quick Diet has made eating healthy so much easier for me. I love that I can still enjoy my favorite Nigerian meals while hitting my goals.”</p>
            <h4>- Elina, Student</h4>
          </div>
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Howard" />
            <p>“The weekly shopping list is a total game changer. I save hours every weekend and I’m never confused in the market anymore.”</p>
            <h4>- Howard, Banker</h4>
          </div>
          <div className="testimonial">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Kiley" />
            <p>“I’ve finally achieved my weight loss goals just by following the plans. Quick Diet keeps me consistent and motivated.”</p>
            <h4>- Kiley, Entrepreneur</h4>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
