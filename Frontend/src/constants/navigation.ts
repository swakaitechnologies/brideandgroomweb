export interface NavItem {
  id: string;
  label: string;
  path: string;
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  id: string;
  label: string;
  count?: number; // Optional notification badge count
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    subItems: [
      { id: "edit_profile", label: "Edit Profile", path: "/profile/edit" },
      { id: "photos", label: "Manage Photos", path: "/profile/photos" },
      { id: "trust", label: "Trust Center", path: "/profile/trust" },
      {
        id: "preferences",
        label: "Partner Preferences",
        path: "/profile/preferences",
      },
      { id: "privacy", label: "Privacy Settings", path: "/profile/privacy" },
    ],
  },
  {
    id: "matches",
    label: "Matches",
    path: "/matches",
    subItems: [
      {
        id: "all_profiles",
        label: "All Profiles",
        path: "/matches/all",
      },
      {
        id: "new_matches",
        label: "New Matches",
        count: 12,
        path: "/matches/new",
      },
      {
        id: "near_me",
        label: "Near Me",
        path: "/matches/near",
      },
      {
        id: "shortlisted",
        label: "Shortlisted",
        count: 5,
        path: "/matches/shortlisted",
      },
      {
        id: "likes",
        label: "Likes",
        path: "/matches/likes",
      },
      {
        id: "viewed_you",
        label: "Who Viewed You",
        count: 3,
        path: "/matches/viewed-you",
      },
      {
        id: "recently_viewed",
        label: "Recently Viewed",
        path: "/matches/recently-viewed",
      },
    ],
  },
  {
    id: "inbox",
    label: "Inbox",
    path: "/inbox",
    subItems: [
      {
        id: "received",
        label: "Received Requests",
        count: 8,
        path: "/inbox/received",
      },
      { id: "accepted", label: "Accepted", path: "/inbox/accepted" },
      { id: "sent", label: "Sent Requests", path: "/inbox/sent" },
      { id: "declined", label: "Declined", path: "/inbox/declined" },
      { id: "chat", label: "Chat", count: 2, path: "/inbox/chat" },
      { id: "notifications", label: "Notifications", path: "/notifications" },
    ],
  },
  {
    id: "search",
    label: "Search",
    path: "/search",
    subItems: [
      { id: "basic_search", label: "Basic Search", path: "/search/basic" },
      {
        id: "advanced_search",
        label: "Advanced Search",
        path: "/search/advanced",
      },
      { id: "id_search", label: "ID Search", path: "/search/id" },
    ],
  },

  {
    id: "stories",
    label: "Success Stories",
    path: "/stories",
    subItems: [
      { id: "view_stories", label: "View Stories", path: "/stories" },
      { id: "share_story", label: "Share Your Story", path: "/stories/submit" },
    ]
  },

  {
    id: "membership",
    label: "Membership",
    path: "/plans",
    subItems: [
      { id: "plans", label: "View Plans", path: "/plans" },
      { id: "my_subscription", label: "My Subscription", path: "/subscription" },
    ]
  },
];





