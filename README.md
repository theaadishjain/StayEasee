# StayEase

StayEase is a full-stack holiday rental platform where travellers can discover and review unique stays, and hosts can list and manage their properties. It is built with Node.js, Express, MongoDB and EJS.

## Features

### Listings
- Browse all stays as photo cards with title and price per night
- Detailed listing page with photo, description, host, price, category, location and country
- Interactive Mapbox map on every listing showing where the stay is
- Hosts can create, edit and delete their own listings
- Automatic geocoding of the listing's location when it is created or edited
- Image uploads to Cloudinary (png, jpg, jpeg, webp up to 5 MB)
- "What this place offers" section with a full amenities modal
- Toggle to display prices including 18% GST
- Deleting a listing also removes its reviews

### Search and filters
- Search by title, category, country or location
- Search by budget: enter a number to see stays at or below that price
- 21 category filters: Rooms, Iconic Cities, Trending, Mountains, Castles, Amazing Pools, Camping, Farm, Arctic, Beach, Boat, Ski-in/out, Apartment, New, Woodlands, Lake, Cabins, Countryside, Bed and Breakfasts, Campsite and Historical Homes
- Scrollable filter bar with arrow buttons and touch swiping on mobile

### Reviews
- Logged-in users can leave a 1 to 5 star rating with a comment
- Authors can delete their own reviews

### Accounts
- Sign up, log in and log out with username and password
- Returns users to the page they were on after logging in
- Only the owner of a listing can edit or delete it, and only the author of a review can delete it

### Security
- CSRF protection on every form
- Passwords hashed and salted with passport-local-mongoose
- Sessions stored in MongoDB with encrypted session data
- Server-side validation of all form data with Joi
- Listing data safely embedded in pages to prevent cross-site scripting

### Error handling
- Friendly error pages and flash messages
- Unknown pages and invalid listing links show a 404 page

## Tech stack

| Area | Technology |
| --- | --- |
| Server | Node.js 20, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Views | EJS with ejs-mate layouts, Bootstrap 5 |
| Authentication | Passport (local strategy), passport-local-mongoose |
| Sessions | express-session with connect-mongo |
| Validation | Joi |
| Image storage | Cloudinary, uploads handled by Multer |
| Maps and geocoding | Mapbox GL JS, Mapbox Geocoding API |
| Security | csrf-sync |

## Getting started

### Prerequisites
- Node.js 20
- MongoDB, either running locally or a MongoDB Atlas database
- A Mapbox account (for maps and geocoding)
- A Cloudinary account (for image uploads)

### Installation

```bash
git clone https://github.com/theaadishjain/StayEasee.git
cd StayEasee
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `ATLASDB_URL` | MongoDB connection string, for example `mongodb://127.0.0.1:27017/stayease` |
| `SECRET` | Long random string used to sign and encrypt sessions |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `MAP_TOKEN` | Mapbox public access token |
| `PORT` | Port to run on (optional, defaults to 8080) |
| `SEED_USERNAME`, `SEED_EMAIL`, `SEED_PASSWORD` | Owner account created by the seed script (optional, defaults to `demo` / `demo1234`) |

If the Cloudinary variables are not all set, uploaded images are saved to `public/uploads` instead. This is meant for local development only.

### Load sample data

```bash
npm run seed
```

This replaces all listings with 29 sample stays and creates the seed owner account if it does not exist. Change `SEED_PASSWORD` before seeding a public database.

### Run the app

```bash
npm start
```

Then open http://localhost:8080 (or the port you set in `PORT`).

## Project structure

```
├── app.js               Express app, sessions, authentication and error handling
├── cloudConfig.js       Cloudinary setup and image upload middleware
├── middlewares.js       Login, ownership and validation middleware
├── schemaValidation.js  Joi schemas for listings and reviews
├── controllers/         Route handlers for listings, reviews and users
├── models/              Mongoose models: Listing, Review, User
├── routes/              Express routers
├── utils/               Error class, async wrapper and CSRF setup
├── views/               EJS templates (layouts, includes, listings, users)
├── public/              CSS, client-side JavaScript and images
└── init/                Sample data and seed script
```

## Routes

| Method | Path | Description |
| --- | --- | --- |
| GET | `/listings` | All listings |
| GET | `/listings/new` | New listing form |
| POST | `/listings` | Create a listing |
| GET | `/listings/:id` | Listing details |
| GET | `/listings/:id/edit` | Edit listing form |
| PUT | `/listings/:id` | Update a listing |
| DELETE | `/listings/:id` | Delete a listing |
| GET | `/listings/search?q=` | Search listings |
| GET | `/listings/filter/:category` | Filter listings by category |
| GET | `/listings/:id/reservelisting` | Reserve button (shows a confirmation message, no booking is stored) |
| POST | `/listings/:id/reviews` | Add a review |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review |
| GET, POST | `/signup` | Sign up |
| GET, POST | `/login` | Log in |
| POST | `/logout` | Log out |

## Deployment

1. Create a MongoDB Atlas database and copy its connection string.
2. Create a web service on a host such as Render, connected to this repository.
3. Set the start command to `npm start`.
4. Add the environment variables listed above in the host's settings, with `NODE_ENV=production`.
5. Run `npm run seed` once against the Atlas database to load the sample listings.

## License

ISC
