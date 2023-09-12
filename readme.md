## Digital Cow Hut API Endpoints

## Live Link: https://digital-cow-bcss28s7a-jisan-hasan.vercel.app/

## User

- api/v1/auth/signup (POST)
- api/v1/users (GET)
- api/v1/users/64ff53c1f7a02f2ce8165f82 (Single GET)
- api/v1/users/64ff53c1f7a02f2ce8165f82 (PATCH)
- api/v1/users/64ff53c1f7a02f2ce8165f82 (DELETE)

## Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/65009e4148d4b15b3ab95f4e (Single GET)
- api/v1/cows/65009e4148d4b15b3ab95f4e (PATCH)
- api/v1/cows/65009e4148d4b15b3ab95f4e (DELETE)

## Pagination & filtering route of cows

- api/v1/cows?page=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Chattogram
- api/v1/cows?searchTerm=Cha

## Orders

- api/v1/orders (POST)
- api/v1/orders (GET)
