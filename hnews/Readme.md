Project Overview
This is the backend for a Hacker-News-clone application. It provides:

User authentication & authorization with JWT access and refresh tokens

Role-based access control (guest vs. admin)

CRUD for submissions (stories, ask/show/job) and comments, with nested replies

Voting on submissions, comments, and users (karma)

Favorites for submissions and comments per user

Admin tools: block/unblock users, delete submissions/comments

Search across users, submissions, comments

Scheduled tasks to auto-unblock users

OpenAPI (Swagger) documentation for all endpoints

Global Error Handler by express-async-errors

Table of Contents

Prerequisites

Installation

Configuration

Running the Server

API Endpoints

Auth Routes

User Routes

Submission Routes

Comment Routes

Admin Routes

Search Routes

Error Handling

Scheduled Tasks

Swagger Documentation

Contributing

License

Prerequisites
Node.js v16+

npm v8+

MongoDB v4+ (local or remote)

Installation
Clone this repository:

git clone https://github.com/your-username/hacker-news-backend.git
cd hacker-news-backend

Install dependencies:

npm install
Create a .env file in the project root with these keys (example in example.env):

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/news-aggregator
JWT_SECRET=supersecretkey

Configuration

config/db.js: connects to MongoDB using process.env.MONGO_URI.

config/cors.js: lists allowed origins, headers, and enables credentials.

config/jwt.js: exports secretKey and default expiry (1h) from environment.

Running the Server

Development (with auto-reload):

npm run dev

Production:

npm start
By default, the server listens on http://localhost:5000.

API Endpoints

All endpoints are prefixed with /api.

Auth Routes

Method	Path	Description	Body
POST	/api/auth/register	Register a new user (guest by default)	{ username, password }
POST	/api/auth/login	Authenticate & issue tokens	{ username, password }
POST	/api/auth/refresh	Refresh access token via refreshToken	{ refreshToken }
POST	/api/auth/logout	Revoke a refresh token	{ refreshToken }

User Routes (Each method response data via viewModels - userViewModel )

Protected by requireAuth.

Method	Path	Description	Body
GET	/api/user/me	Get your profile (no password)	—
PUT	/api/user/me	Update your “about” field	{ about }
PUT	/api/user/change-password	Change your password	{ oldPassword, newPassword }
POST	/api/user/me/favorites/submission/:submissionId	Favorite a submission	—
DELETE	/api/user/favorites/submissions/:submissionId	Unfavorite a submission	—
POST	/api/user/me/favorites/comment/:commentId	Favorite a comment	—
DELETE	/api/user/favorites/comments/:commentId	Unfavorite a comment	—
DELETE	/api/user/submissions/:submissionId	Delete one of your submissions	—
PUT	/api/user/:userId/vote	Upvote a user’s karma (and unvote)	—

Submission Routes(Each method response data via viewModels - submissionViewModel)

Some open, some protected by requireAuth.

Method	Path	Description	Body
GET	/api/submission/	List latest story-type submissions	—
GET	/api/submission/past	List oldest story-type submissions	—
GET	/api/submission/new	List newest (all types)	—
GET	/api/submission/ask	List ask submissions	—
GET	/api/submission/show	List show submissions	—
GET	/api/submission/job	List job submissions	—
GET	/api/submission/:submissionId/owner	Get owner (user view-model)	—
GET	/api/submission/day/back	Submissions in last 24 h	—
GET	/api/submission/month/back	Submissions in last 30 days	—
GET	/api/submission/year/back	Submissions in last 365 days	—
POST	/api/submission/	Create a new submission	{ title, url, text?, specific? }
POST	/api/submission/:submissionId/vote	Upvote submission	—
POST	/api/submission/:submissionId/unvote	Remove vote	—

Comment Routes  (Each method response data via viewModels - commentViewModel)

Method	Path	Description	Body
GET	/api/comment/:submissionId	List comments for a submission	—
POST	/api/comment/submissions/:submissionId/comments	Create a new comment	{ text }
POST	/api/comment/:commentId/vote	Upvote a comment	—
POST	/api/comment/:commentId/unvote	Remove comment vote	—
GET	/api/comment/:commentId/parent	Get parent or submission if root	—
GET	/api/comment/:commentId/context	Get context (submission + all comments)	—
GET	/api/comment/:commentId/submission	Get the submission for a comment	—
GET	/api/comment/:commentId/owner	Get the comment’s owner (user view-model)	—
GET	/api/comment/:commentId/previous	Get chronologically previous comment	—
GET	/api/comment/:commentId/next	Get chronologically next comment	—
POST	/api/comment/:parentId/reply	Reply to a comment	{ text }
GET	/api/comment/:commentId/children	List only direct children (replies)	—
GET /api/comment/    get all comments from DB 

Admin Routes

Protected by requireAuth + roleMiddleware('admin').


Method	Path	Description	Body
POST	/api/admin/block/:userId	Block a user (temporary/permanent)	{ blockingType }
POST	/api/admin/unblock/:userId	Unblock a user	—
DELETE	/api/admin/submission/:submissionId	Delete any submission	—
DELETE	/api/admin/comment/:commentId	Delete comment + children	—
GET	/api/admin/users	List all users (no passwords)	—
GET	/api/admin/find-user	Find user by username	{ username? }

Search Routes(Each method response data via viewModels)

Method	Path	Description	Query
GET	/api/search?q=...	Search across users/submissions/comments	?q=some text or name

Error Handling

All errors bubble up to a central error-handler in middleware/errorHandler.js.

Known errors carry { status, message } and return that HTTP code + JSON { error: message }.

Unexpected errors return 500 + { error: 'Internal server error' }.

Scheduled Tasks

In schedulers/unblockScheduler.js we run a cron job every hour to unfreeze users whose blockedUntil has passed.

Swagger Documentation
After starting the server, visit:

http://localhost:5000/api-docs
to explore all endpoints, view schemas, and even try them.

View Models 
for clear code and response all data goes through view Models to make frontend work easier

commentContextViewModel 
commentViewModel
submissionViewModel
userViewModel

Validation used for correct data tranfare

authValidators - with registerValidation , loginValidation
commentValidators - with createCommentValidation, commentIdValidation
submissionValidators - with submissionIdValidation, createSubmissionValidation
userValidators - with userIdValidation, changePasswordValidation, updateProfileValidation,
updateUserAboutValidation, findUserByUsernameValidation

All controllers do not use access to DB that part is separated from bussiness logic and stored in
utils/ Services

commentService - for actions with comments
searchService - 
searchService
submissionService
UserService

All written code is commented in Google Styles with adding JsDocs when reasonable.

Contributing
Fork & clone

Create a feature branch

Install deps & write tests

Submit a PR with clear description

License
This project is released under the MIT License.