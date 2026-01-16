import Navbar from './Navbar.jsx'
import HomeProduct from './HomeProduct.jsx'
import FeatureSection from './FeatureSection.jsx'
import ProductPage from './ProductPage.jsx'
import PricingPage from './PricingPage.jsx'
import imgFeature1 from '../assets/createfacture.png'
import imgFeature2 from '../assets/AjouteClient.png'
import imgFeature3 from '../assets/AssistantIA.png'


function LandingPage() {
  return (
    <div className="min-h-screen bg-dark">
        <Navbar />
          <HomeProduct />
        <div id="product">
            <ProductPage />
        </div>
        


        <div id="features">
          <FeatureSection
              title="Create Invoices Effortlessly"
              description="Generate professional invoices with just a few clicks. No more templates or manual work."
              image={imgFeature1}
              reverse={true}
          />
          <FeatureSection
              title="Add clients easily"
              description="Manage your clients efficiently by adding and organizing their information in one place."
              image={imgFeature2}
          />

          <FeatureSection
              title="Use AI to speed up your invoicing"
              description="Leverage artificial intelligence to automate invoice creation and reduce errors."
              image={imgFeature3}
              reverse={true}
          />
        </div>

        <div id="pricing">
          <PricingPage />
        </div>

        
    </div>
  )
}

export default LandingPage