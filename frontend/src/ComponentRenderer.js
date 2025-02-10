import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SaaSProductLandingPage from "demos/SaaSProductLandingPage.js";

import SaaSProductLandingPageImageSrc from "images/demo/SaaSProductLandingPage.jpeg";

import BlogIndexPage from "pages/BlogIndex.js";
import LoginPage from "pages/Login.js";
import PrivacyPolicyPage from "pages/PrivacyPolicy.js";
import SignupPage from "pages/Signup.js";
import TermsOfServicePage from "pages/TermsOfService.js";

import BlogIndexPageImageSrc from "images/demo/BlogIndexPage.jpeg";
import LoginPageImageSrc from "images/demo/LoginPage.jpeg";
import PrivacyPolicyPageImageSrc from "images/demo/PrivacyPolicyPage.jpeg";
import SignupPageImageSrc from "images/demo/SignupPage.jpeg";
import TermsOfServicePageImageSrc from "images/demo/TermsOfServicePage.jpeg";

// import FullWidthWithImageHero from "components/hero/FullWidthWithImage.js";
// import FeaturesAndTestimonialHero from "components/hero/TwoColumnWithFeaturesAndTestimonial.js";
import IllustrationAndInputHero from "components/hero/TwoColumnWithInput.js";

import ThreeColWithSideImageFeatures from "components/features/ThreeColWithSideImage.js";
import TwoColWithButtonFeatures from "components/features/TwoColWithButton.js";
import WithStepsAndImageFeatures from "components/features/TwoColWithSteps.js";

import SliderCards from "components/cards/ThreeColSlider.js";

import ThreeColSimpleWithImageBlog from "components/blogs/ThreeColSimpleWithImage.js";

import TwoColumnWithImageAndRatingTestimonial from "components/testimonials/TwoColumnWithImageAndRating.js";

import SingleColFAQS from "components/faqs/SingleCol.js";

import SimpleContactUsForm from "components/forms/SimpleContactUs.js";
import SimpleSubscribeNewsletterForm from "components/forms/SimpleSubscribeNewsletter.js";
import TwoColContactUsForm from "components/forms/TwoColContactUsWithIllustration.js";
import TwoColContactUsFullForm from "components/forms/TwoColContactUsWithIllustrationFullForm.js";

import DownloadAppCTA from "components/cta/DownloadApp.js";
import GetStartedCTA from "components/cta/GetStarted.js";

import FiveColumnDarkFooter from "components/footers/FiveColumnDark.js";
import FiveColumnWithBackgroundFooter from "components/footers/FiveColumnWithBackground.js";
import FiveColumnWithInputFormFooter from "components/footers/FiveColumnWithInputForm.js";
import MiniCenteredFooter from "components/footers/MiniCenteredFooter.js";
import SimpleFiveColumnFooter from "components/footers/SimpleFiveColumn.js";
import { fetchContentsBySlug } from "pages/Content/ContentService";
import ContentTemplate from "pages/Content/ContentTemplate";
import Control from "pages/Control/Control";
import DetailsPage from "pages/Details/Details";
import Jail from "pages/LetterTypes/Jail";
import JailDisabled from "pages/LetterTypes/JailDisabled";
import PaymentPage from "pages/Payment/Payment";
import UserAccountPage from "pages/UserAccount/UserAccount.js";

export const components = {
  landingPages: {
    SaaSProductLandingPage: {
      component: SaaSProductLandingPage,
      imageSrc: SaaSProductLandingPageImageSrc,
      url: "/components/landingPages/SaaSProductLandingPage",
    },
  },

  letterTypes: {
    Jail: {
      component: Jail,
      imageSrc: "",
      url: "/components/letterTypes/Jail",
    },
    JailDisabled: {
      component: JailDisabled,
      imageSrc: "",
      url: "/components/letterTypes/JailDisabled",
    },
    DetailsPage: {
      component: DetailsPage,
      imageSrc: "",
      url: "/components/letterTypes/DetailsPage",
    },
    PaymentPage: {
      component: PaymentPage,
      imageSrc: "",
      url: "/components/letterTypes/PaymentPage",
    },
    Control: {
      component: Control,
      imageSrc: "",
      url: "/components/letterTypes/Control",
    },
  },

  innerPages: {
    LoginPage: {
      component: LoginPage,
      imageSrc: LoginPageImageSrc,
      scrollAnimationDisabled: true,
      url: "/components/innerPages/LoginPage",
    },
    SignupPage: {
      component: SignupPage,
      url: `/components/innerPages/SignupPage`,
      imageSrc: SignupPageImageSrc,
      scrollAnimationDisabled: true,
    },
    BlogIndexPage: {
      component: BlogIndexPage,
      url: `/components/innerPages/BlogIndexPage`,
      imageSrc: BlogIndexPageImageSrc,
    },
    TermsOfServicePage: {
      component: TermsOfServicePage,
      url: `/components/innerPages/TermsOfServicePage`,
      imageSrc: TermsOfServicePageImageSrc,
    },
    PrivacyPolicyPage: {
      component: PrivacyPolicyPage,
      url: `/components/innerPages/PrivacyPolicyPage`,
      imageSrc: PrivacyPolicyPageImageSrc,
    },
    UserAccountPage: {
      component: UserAccountPage,
      imageSrc: "",
      url: "/components/innerPages/UserAccountPage",
    },
  },

  blocks: {
    Hero: {
      type: "Hero Section",
      elements: {
        IllustrationAndInput: {
          name: "With Image Illustration and Input",
          component: IllustrationAndInputHero,
          url: "/components/blocks/Hero/IllustrationAndInput",
        },
        // FeaturesAndTestimonial: {
        //   name: "With Features And Customer Testimonial",
        //   component: FeaturesAndTestimonialHero,
        //   url: "/components/blocks/Hero/FeaturesAndTestimonial",
        // },
        // FullWidthWithImage: {
        //   name: "Full Width With Image",
        //   component: FullWidthWithImageHero,
        //   url: "/components/blocks/Hero/FullWidthWithImage",
        // },
      },
    },
    Features: {
      type: "Features Section",
      elements: {
        ThreeColWithSideImage: {
          name: "Three Column With Side Image",
          component: ThreeColWithSideImageFeatures,
          url: "/components/blocks/Features/ThreeColWithSideImage",
        },
        TwoColWithButton: {
          name: "Two Column With Image and Action Button",
          component: TwoColWithButtonFeatures,
          url: "/components/blocks/Features/TwoColWithButton",
        },
        WithStepsAndImage: {
          name: "Steps with Image",
          component: WithStepsAndImageFeatures,
          url: "/components/blocks/Features/WithStepsAndImage",
        },
      },
    },

    Cards: {
      type: "Cards",
      elements: {
        Slider: {
          name: "Three Column Slider",
          component: SliderCards,
          url: "/components/blocks/Cards/Slider",
        },
      },
    },

    Blog: {
      type: "Blog Section",
      elements: {
        ThreeColSimpleWithImage: {
          name: "Simple Three Column With Image",
          component: ThreeColSimpleWithImageBlog,
          url: "/components/blocks/Blog/ThreeColSimpleWithImage",
        },
      },
    },

    Testimonial: {
      type: "Testimonial Section",
      elements: {
        TwoColumnWithImageAndRating: {
          name: "Two Column With Image And Rating",
          component: TwoColumnWithImageAndRatingTestimonial,
          url: "/components/blocks/Testimonial/TwoColumnWithImageAndRating",
        },
      },
    },

    FAQS: {
      type: "FAQs Section",
      elements: {
        SingleCol: {
          name: "Single Column",
          component: SingleColFAQS,
          url: "/components/blocks/FAQS/SingleCol",
        },
      },
    },

    Form: {
      type: "Forms Section",
      elements: {
        SimpleContactUs: {
          name: "Simple Contact Us",
          component: SimpleContactUsForm,
          url: "/components/blocks/Form/SimpleContactUs",
        },
        SimpleSubscribeNewsletter: {
          name: "Simple Subscribe newsletter",
          component: SimpleSubscribeNewsletterForm,
          url: "/components/blocks/Form/SimpleSubscribeNewsletter",
        },
        TwoColContactUs: {
          name: "Two Column Contact Us",
          component: TwoColContactUsForm,
          url: "/components/blocks/Form/TwoColContactUs",
        },
        TwoColContactUsFull: {
          name: "Two Column Contact Us - Full Form",
          component: TwoColContactUsFullForm,
          url: "/components/blocks/Form/TwoColContactUsFull",
        },
      },
    },

    CTA: {
      type: "CTA Section",
      elements: {
        GetStarted: {
          name: "Get Started",
          component: GetStartedCTA,
          url: "/components/blocks/CTA/GetStarted",
        },
        DownloadApp: {
          name: "Download App",
          component: DownloadAppCTA,
          url: "/components/blocks/CTA/DownloadApp",
        },
      },
    },

    Footer: {
      type: "Footers Section",
      elements: {
        SimpleFiveColumn: {
          name: "Simple Five Column",
          component: SimpleFiveColumnFooter,
          url: "/components/blocks/Footer/SimpleFiveColumn",
        },
        FiveColumnWithInputForm: {
          name: "Five Column With Input Form",
          component: FiveColumnWithInputFormFooter,
          url: "/components/blocks/Footer/FiveColumnWithInputForm",
        },
        FiveColumnWithBackground: {
          name: "Five Column With background",
          component: FiveColumnWithBackgroundFooter,
          url: "/components/blocks/Footer/FiveColumnWithBackground",
        },
        FiveColumnDark: {
          name: "Five Column Dark",
          component: FiveColumnDarkFooter,
          url: "/components/blocks/Footer/FiveColumnDark",
        },
        MiniCentered: {
          name: "Mini Centered Dark",
          component: MiniCenteredFooter,
          url: "/components/blocks/Footer/MiniCentered",
        },
      },
    },
  },
};

export default () => {
  const { type, subtype, name, slug } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (type === "content" && slug) {
        const post = await fetchContentsBySlug(slug);
        setBlogPost(post);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [type, slug]);

  if (loading && type === "content" && slug) {
    return null;
  }

  try {
    let Component = null;

    if (type === "content" && blogPost) {
      return (
        <ContentTemplate
          title={blogPost.title}
          text={blogPost.text}
          createdAt={blogPost.created_at}
        />
      );
    }

    if (type === "blocks" && subtype) {
      Component = components[type][subtype]["elements"][name].component;
      return (
        <AnimationRevealPage disabled>
          <Component />
        </AnimationRevealPage>
      );
    } else {
      Component = components[type][name].component;
    }

    if (Component) return <Component />;

    throw new Error("Component Not Found");
  } catch (e) {
    console.log(e);
    return <div>Error: Component Not Found</div>;
  }
};
