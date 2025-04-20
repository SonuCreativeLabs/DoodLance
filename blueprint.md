Here's a **phase-by-phase prompt blueprint** to systematically build our app:

---

### **Phase 1: MVP Client Interface**  
**Objective**: Build core client-facing features for job posting/hiring  

#### **Step 1.1 - Welcome & Auth Flow**  
"Design a splash screen with app logo animation (3s duration) followed by phone number input with country code selector. Implement OTP verification flow with resend option. After OTP confirmation, show role selection screen with two large buttons: 'Hire' (Client) and 'Work' (Freelancer)."

#### **Step 1.2 - Client Home Screen**  
"Create a mobile-first home screen with:  
1. Welcome banner showing client's name and location  
2. Search bar with placeholder 'Find plumbers, tutors...'  
3. Horizontal scroll of popular service categories (plumbing, tutoring, pet care)  
4. Grid layout of nearby freelancer profiles (profile pic, skills, rating)  
5. Ad placeholder banner at bottom"

#### **Step 1.3 - Job Posting System**  
"Build a job posting interface with:  
- Form fields: Title, description, budget, location (map pin drop)  
- Two tabbed sections:  
  a) **Post Job**: AI-assisted description generator and auto tag, auto catagorize the jobs to its catagory. 
  b) **Direct Hire**: Map view of available freelancers  
- Budget suggestion tool based on service category"

#### **Step 1.4 - Hires Management**  
"Develop a hires dashboard with:  
- **Active** tab: current and upcoming works 
- **Applications** tab: Tinder-style and accept/reject applicant cards (swipe left/right)  
- **History** tab: Past hires with rating/review system  
- Status filters (Pending/Approved/Completed)"

#### **Step 1.5 - Client Inbox**  
"Implement chat system with:  
- Thread list showing freelancer names/last messages  
- Chat window with text input, file attachment, and send button  
- Message status indicators (sent/delivered/read)"

#### **Step 1.6 - Role Switching**  
"Add 'Switch to Freelancer Mode' justlike zoomcar user and host switching toggle button in client profile:  
- seemless migration.  
- Profile migration wizard for existing jobs  
- Return-to-client toggle confirmation"

###Client Interface
"Navigation Structure:
"Home" | "Hires" | "Post" | "Inbox" | "Work & Earn""

---

### **Phase 2: MVP Freelancer Interface**  
**Objective**: Enable freelancers to find/manage work  

#### **Step 2.1 - Freelancer Home Feed**  
"Create a feed showing:  
1. Welcome message with earnings summary  
2. Your listing with Availability calendar toggle
3. 'Recommended Jobs' carousel with quick-apply buttons  
4. 'Your Skills' section with proficiency progress bars  


#### **Step 2.2 - Job Discovery System**  
"Build dual-view discovery interface:  
- **Map View**: Interactive map with job pins (color-coded by category)  
- **List View**: Filterable job cards (price, distance, ratings)  
- Radius selector (1-10km range) and category filters"

#### **Step 2.3 - Application Management**  
"Develop job tracking dashboard with:  
- **Upcoming** tab: Accepted jobs with client details  
- **Applications** tab: Status pipeline (Applied/Interviewing/Hired)  
- **Earnings** tab: Payment history with withdrawal options"

#### **Step 2.4 - Freelancer Profile**  
"Create profile editor with:  
- KYC verification flow (ID upload, selfie check)  
- Skill matrix builder with experience levels  
- Portfolio gallery (image/video upload)  
- Client rating display (1-5 stars)"

###Freelancer Interface
"Navigation Structure:
"Feed" | "Discover" | "Jobs" | "Inbox" | "Profile""
---

### **Phase 3: AI Integration**  
**Objective**: Add intelligent features  

#### **Step 3.1 - Job Categorization**  
"Implement AI that auto-tags jobs to categories (plumbing/tutoring/etc) based on description text. Train model using local service keywords and past job data."

#### **Step 3.2 - Rate Suggestions**  
"Build tool suggesting optimal pricing using:  
- Local market averages per service  
- Freelancer experience level  
- Job complexity indicators"

#### **Step 3.3 - Smart Matching**  
"Develop matching algorithm prioritizing:  
- Client budget vs freelancer rates  
- Location proximity  
- Skill compatibility  
- Historical ratings"

---

### **Phase 4: Advanced Features**  
**Objective**: Enhance core functionality  

#### **Step 4.1 - Map Enhancements**  
"Add heatmaps showing:  
- Service demand density  
- Earnings potential zones  
- Competitor activity areas"

#### **Step 4.2 - Payment System**  
"Implement escrow payments with:  
- Client fund holding during jobs  
- Milestone-based releases  
- Dispute resolution workflow"

#### **Step 4.3 - Review System**  
"Create two-way rating system where:  
- Clients rate work quality  
- Freelancers rate client responsiveness  
- Display aggregate scores publicly"

#### **Step 4.4 - PWA Optimization**  
"Enable offline mode caching:  
- Recent job listings  
- Profile data  
- Chat history"
