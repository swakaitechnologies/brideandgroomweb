import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { Providers } from "./providers";
import { ProtectedRoute, GuestOnlyRoute } from "./components/auth/ProtectedRoute";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy-loaded route components for code splitting
const LandingPage = lazy(() => import("./modules/landing/LandingPage"));
const AboutUsPage = lazy(() => import("./modules/support/AboutUsPage"));
const LoginPage = lazy(() => import("./modules/auth/LoginPage"));
const RegisterPage = lazy(() => import("./modules/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./modules/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./modules/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./modules/auth/VerifyEmailPage"));

// Matches
const NewMatchesPage = lazy(() => import("./modules/matches/NewMatchesPage"));
const NearMePage = lazy(() => import("./modules/matches/NearMePage"));
const ShortlistedPage = lazy(() => import("./modules/matches/ShortlistedPage"));
const LikesPage = lazy(() => import("./modules/matches/LikesPage"));
const WhoViewedYouPage = lazy(() => import("./modules/matches/WhoViewedYouPage"));
const RecentlyViewedPage = lazy(() => import("./modules/matches/RecentlyViewedPage"));
const ProfileDetailsPage = lazy(() => import("./modules/matches/ProfileDetailsPage"));
const AllProfilesPage = lazy(() => import("./modules/matches/AllProfilesPage"));

// Profile
const ProfilePage = lazy(() => import("./modules/profile/ProfilePage"));
const EditProfilePage = lazy(() => import("./modules/profile/EditProfilePage"));
const PhotosPage = lazy(() => import("./modules/profile/PhotosPage"));
const TrustCenterPage = lazy(() => import("./modules/profile/TrustCenterPage"));
const PartnerPreferencesPage = lazy(() => import("./modules/profile/PartnerPreferencesPage"));
const PrivacySettingsPage = lazy(() => import("./modules/profile/PrivacySettingsPage"));

// Inbox
const ReceivedRequestsPage = lazy(() => import("./modules/inbox/ReceivedRequestsPage"));
const AcceptedRequestsPage = lazy(() => import("./modules/inbox/AcceptedRequestsPage"));
const SentRequestsPage = lazy(() => import("./modules/inbox/SentRequestsPage"));
const DeclinedRequestsPage = lazy(() => import("./modules/inbox/DeclinedRequestsPage"));
const NotificationsPage = lazy(() => import("./modules/inbox/NotificationsPage"));
const ChatPage = lazy(() => import("./modules/inbox/ChatPage"));

// Search
const BasicSearchPage = lazy(() => import("./modules/search/BasicSearchPage"));
const AdvancedSearchPage = lazy(() => import("./modules/search/AdvancedSearchPage"));
const IDSearchPage = lazy(() => import("./modules/search/IDSearchPage"));
const SearchResultsPage = lazy(() => import("./modules/search/SearchResultsPage"));

// Payment
const PlansPage = lazy(() => import("./modules/payment/PlansPage"));
const PaymentSuccessPage = lazy(() => import("./modules/payment/PaymentSuccessPage"));
const SubscriptionPage = lazy(() => import("./modules/payment/SubscriptionPage"));

// Rest
const SuccessStoriesPage = lazy(() => import("./modules/landing/SuccessStoriesPage"));
const StorySubmissionPage = lazy(() => import("./modules/profile/StorySubmissionPage"));
const ContactPage = lazy(() => import("./modules/support/ContactPage"));
const FeedbackPage = lazy(() => import("./modules/support/FeedbackPage"));
const TermsPage = lazy(() => import("./modules/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./modules/legal/PrivacyPage"));
const RefundPage = lazy(() => import("./modules/legal/RefundPage"));
const CookiePolicyPage = lazy(() => import("./modules/support/CookiePolicyPage"));
const BannedPage = lazy(() => import("./modules/BannedPage"));
const Page404 = lazy(() => import("./modules/error/Page404"));
const Page505 = lazy(() => import("./modules/error/Page505"));
const ComingSoon = lazy(() => import("./components/shared/ComingSoon"));

// Full-page loading spinner for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      <p className="text-sm text-muted-foreground tracking-wider">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/stories" element={<SuccessStoriesPage />} />
            <Route path="/505" element={<Page505 />} />

            <Route path="/blogs" element={<ComingSoon title="Our Blog" />} />
            <Route path="/careers" element={<ComingSoon title="Careers" />} />
            <Route path="/help" element={<ComingSoon title="Help Center" />} />
            <Route path="/safety" element={<ComingSoon title="Safety Center" />} />
            <Route path="/weddings" element={<ComingSoon title="Wedding Directory" />} />
            <Route path="/vip" element={<ComingSoon title="VIP Matchmaking" />} />
            <Route path="/astrology" element={<ComingSoon title="Astrology Services" />} />

            {/* Guest Only Routes */}
            <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
            <Route path="/register" element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />
            <Route path="/forgot-password" element={<GuestOnlyRoute><ForgotPasswordPage /></GuestOnlyRoute>} />
            <Route path="/reset-password" element={<GuestOnlyRoute><ResetPasswordPage /></GuestOnlyRoute>} />
            <Route path="/verify-email" element={<GuestOnlyRoute><VerifyEmailPage /></GuestOnlyRoute>} />

            {/* Protected Area */}
            <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/matches" replace /></ProtectedRoute>} />
            
            {/* Matches System */}
            <Route path="/matches" element={<ProtectedRoute><AllProfilesPage /></ProtectedRoute>} />
            <Route path="/matches/all" element={<ProtectedRoute><AllProfilesPage /></ProtectedRoute>} />
            <Route path="/matches/new" element={<ProtectedRoute><NewMatchesPage /></ProtectedRoute>} />
            <Route path="/matches/near" element={<ProtectedRoute><NearMePage /></ProtectedRoute>} />
            <Route path="/matches/shortlisted" element={<ProtectedRoute><ShortlistedPage /></ProtectedRoute>} />
            <Route path="/matches/today" element={<ProtectedRoute><AllProfilesPage /></ProtectedRoute>} />
            <Route path="/matches/likes" element={<ProtectedRoute><LikesPage /></ProtectedRoute>} />
            <Route path="/matches/viewed-you" element={<ProtectedRoute><WhoViewedYouPage /></ProtectedRoute>} />
            <Route path="/matches/recently-viewed" element={<ProtectedRoute><RecentlyViewedPage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfileDetailsPage /></ProtectedRoute>} />

            {/* Profile System */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/profile/photos" element={<ProtectedRoute><PhotosPage /></ProtectedRoute>} />
            <Route path="/profile/trust" element={<ProtectedRoute><TrustCenterPage /></ProtectedRoute>} />
            <Route path="/profile/preferences" element={<ProtectedRoute><PartnerPreferencesPage /></ProtectedRoute>} />
            <Route path="/profile/privacy" element={<ProtectedRoute><PrivacySettingsPage /></ProtectedRoute>} />

            {/* Inbox & Communication */}
            <Route path="/inbox" element={<ProtectedRoute><ReceivedRequestsPage /></ProtectedRoute>} />
            <Route path="/inbox/received" element={<ProtectedRoute><ReceivedRequestsPage /></ProtectedRoute>} />
            <Route path="/inbox/accepted" element={<ProtectedRoute><AcceptedRequestsPage /></ProtectedRoute>} />
            <Route path="/inbox/sent" element={<ProtectedRoute><SentRequestsPage /></ProtectedRoute>} />
            <Route path="/inbox/declined" element={<ProtectedRoute><DeclinedRequestsPage /></ProtectedRoute>} />
            <Route path="/inbox/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

            {/* Search System */}
            <Route path="/search" element={<ProtectedRoute><BasicSearchPage /></ProtectedRoute>} />
            <Route path="/search/basic" element={<ProtectedRoute><BasicSearchPage /></ProtectedRoute>} />
            <Route path="/search/advanced" element={<ProtectedRoute><AdvancedSearchPage /></ProtectedRoute>} />
            <Route path="/search/id" element={<ProtectedRoute><IDSearchPage /></ProtectedRoute>} />
            <Route path="/search/results" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />

            {/* Payment & Subscription */}
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />

            {/* Support & Others */}
            <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
            <Route path="/stories/submit" element={<ProtectedRoute><StorySubmissionPage /></ProtectedRoute>} />
            <Route path="/banned" element={<ProtectedRoute><BannedPage /></ProtectedRoute>} />
            
            {/* Catch-all for 404s */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
