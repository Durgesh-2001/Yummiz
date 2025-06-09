import React from 'react'
import './Legal.css'

const Legal = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <div className="terms-conditions">
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Effective Date: Friday, 21 March 2025</p>
          <p className="location">Location: Bengaluru, Karnataka, India</p>

          <div className="intro">
            <p>Welcome to Yummiz! By accessing or using our services, you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully before using the Yummiz platform.</p>
          </div>

          <div className="terms-sections">
            {termsData.map((term, index) => (
              <section key={index} className="term-section">
                <h2>{term.title}</h2>
                {Array.isArray(term.content) ? (
                  <ul>
                    {term.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{term.content}</p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const termsData = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing Yummiz's website or mobile application, you confirm your acceptance of these Terms. If you do not agree, you may not use our services."
  },
  {
    title: "2. Changes to Terms",
    content: "Yummiz reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use constitutes acceptance of updated Terms."
  },
  {
    title: "3. User Accounts",
    content: [
      "Users must register an account to access personalized features (e.g., saving recipes).",
      "Accurate and complete information is required during registration.",
      "Users are responsible for maintaining the confidentiality of their login credentials."
    ]
  },
  {
    title: "4. Eligibility",
    content: "To use Yummiz, you must be at least 13 years old. If you are under 18, parental or legal guardian consent is required."
  },
  {
    title: "5. Use of the Platform",
    content: [
      "Use the platform solely for lawful purposes.",
      "Not engage in unauthorized activities, such as scraping data or attempting to hack the system.",
      "Refrain from posting inappropriate, offensive, or copyrighted content without proper permissions."
    ]
  },
  {
    title: "6. Content Ownership and Licensing",
    content: [
      "All content, including recipes, images, and text, on Yummiz is owned or licensed by us. Unauthorized use of our content is prohibited.",
      "By submitting content (e.g., recipes or images), you grant Yummiz a non-exclusive, royalty-free license to use, modify, or distribute the content for business purposes."
    ]
  },
  {
    title: "7. Liability Disclaimer",
    content: [
      "Yummiz provides recipes and content \"as is\" and does not guarantee their accuracy, reliability, or suitability.",
      "Yummiz is not responsible for any adverse outcomes resulting from recipe usage (e.g., allergies or other health risks)."
    ]
  },
  {
    title: "8. Third-Party Links",
    content: "Yummiz may contain links to external websites or services. We are not responsible for the content or practices of these third-party sites."
  },
  {
    title: "9. Privacy",
    content: "Our Privacy Policy explains how we collect, use, and protect your personal information. By using Yummiz, you agree to our Privacy Policy."
  },
  {
    title: "10. Termination of Services",
    content: "Yummiz reserves the right to suspend or terminate user accounts if there is a violation of these Terms or any harmful activity."
  },
  {
    title: "11. Governing Law",
    content: "These Terms will be governed by and construed in accordance with the laws of India."
  },
  {
    title: "12. Contact Us",
    content: "For questions regarding these Terms, contact us at support@yummiz.com"
  }
]

export default Legal