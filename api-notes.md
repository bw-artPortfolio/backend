# Data Design

## Artist

- `id` globally unique number (created on BE)
- `username` unique string
- `password` secret string
- `likes` list of numbers

## Entry

- `id` globally unique number (created on BE)
- `url` string
- `artistId` number (created and fetched by BE)
- `title` string or null
- `description` string or null
- `score` number (created and managed by BE)

note: An entry's ID number is unique among all entries from all artists, but is separate from artists' ID numbers. So while two entries from different artists may not share the same ID number, an entry's ID and an artist's ID can have the same value.

# API

(`*` means unfinished)

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

*POST `/entries` (art post)
```js
body = {
  "url": "the url of the image",
  "description": "(optional) text about the image",
  "title": "(optional for now) a short title for the image"
}
res = {
  "id": "(number) the globally unique ID number for your entry"
}
```

*PUT `/entries/:id` (modify art post)
```js
body = {
  "url": "(optional)",
  "description": "(optional)"
}
```

*GET `/entries` (get limited info for all entries)
```js
res = {
  "entries": [
    {
      "id": "(number) globally unique entry ID number",
      "url": "url for the image"
    }
  ]
}
```

*GET `/entries/:id` (get all info for a single entry)
```js
res = {
  "id": "(number) globally unique entry ID number",
  "url": "the entry's image's url",
  "artistName": "unique username of the creator of the entry",
  "artistId": "(number) the creator's ID number",
  "description": "a text description of the image",
  "score": "(number) the total number of votes by artists"
}
```

*DELETE `/entries/:id` (delete a single entry)

*GET `/artists/:id` (get all entries for a given artist)
```js
res = {
  "id": "(number) ID number for the artist/user"
  "entries": [
    {
      "id": "(number) globally unique entry ID number",
      "url": "url for the image"
    }
  ]
  "likes": [
    "(number) ID number of upvoted entry"
  ]
}
```

*DELETE `/account` (remove artist account from database)

*POST `/entries/:id/like` (like a post)

*DELETE `/entries/:id/like` (unlike a post)
