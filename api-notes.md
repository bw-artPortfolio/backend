
# Data Design

## Artist

- `id` unique number (created on BE)
- `username` unique string
- `password` secret string
- `votes` list of numbers

## Entry

- `address` or `imgURL` or `url` string
- `artistId` number (created and fetched by BE)
- `title` string or null
- `description` string or null
- `score` number (created and managed by BE)

# API

POST `/register` (get an account for an artist)
```js
body = {
  username,
  password
}
```

POST `/login`
```js
body = {
  username,
  password
}
res = {
  "id": "(number) the ID number for the user",
  "token": "authentication token for the session"
}
```

POST `/entries` (art post)
```js
body = {
  "address": "the url of the image",
  "description": "(optional) text about the image",
  "title": "(optional for now) a short title for the image"
}
res = {
  "id": "(number) the globally unique ID number for your entry"
}
```

PUT `/entries/:id` (modify art post)
```js
body = {
  "address": "(optional)",
  "description": "(optional)"
}
```

GET `/entries` (get limited info for all entries)
```js
res = {
  "entries": [
    {
      "id": "(number) globally unique entry ID number",
      "address": "url for the image"
    }
  ]
}
```

GET `/entries/:id` (get all info for a single entry)
```js
res = {
  "id": "(number) globally unique entry ID number",
  "address": "the entry's image's url",
  "artistName": "unique username of the creator of the entry",
  "artistId": "(number) the creator's ID number",
  "description": "a text description of the image",
  "score": "(number) the total number of votes by artists"
}
```

DELETE `/entries/:id` (delete a single entry)

GET `/artist/:id` (get all entries for a given artist)
```js
res = {
  "id": "(number) ID number for the artist/user"
  "entries": [
    {
      "id": "(number) globally unique entry ID number",
      "address": "url for the image"
    }
  ]
  "votes": [
    "(number) ID number of upvoted entry"
  ]
}
```

DELETE `/account` (remove artist account from database)

# TODO

- how are votes going to work?
