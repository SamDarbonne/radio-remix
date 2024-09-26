export interface SongDocument {
  _id: string;
  name: string;
  artists: Partial<ArtistDocument>[];
  url: string;
  type: string;
  album: Partial<AlbumDocument>;
  duration: number;
  createdAt: string;
}

export interface SongData {
  documents: SongDocument[];
  page: number;
  totalPages: number;
  id: string;
}

export interface ArtistDocument {
  _id: string;
  name: string;
  pseudonyms?: string[];
  albums: AlbumDocument[];
  dateAdded: Date;
}

export interface ArtistData {
  documents: ArtistDocument[];
  page: number;
  totalPages: number;
}

export interface AlbumDocument {
  _id: string;
  name: string;
  artists: Partial<ArtistDocument>[];
  songs: Partial<SongDocument>[];
  releaseDate: Date;
  lastPlayed?: Date;
  imageFilename?: string;
}

export interface AlbumData {
  documents: AlbumDocument[];
  page: number;
  totalPages: number;
}

export type Query = "recent" | "popular";

type MethodOptions = "GET" | "POST" | "PUT" | "DELETE";

export const BASE_URL = "http://localhost:4000";

const fetchData = async (
  url: string,
  method: MethodOptions,
  body?: object | FormData
) => {
  try {
    const options: RequestInit = {
      method,
    };
    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.headers = {
          "Content-Type": "application/json",
        };
        options.body = JSON.stringify(body);
      }
    }
    const response = await fetch(url, options);
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const uploadSongs = async (formData: FormData): Promise<SongData[]> => {
  return await fetchData(`${BASE_URL}/songs`, "POST", formData);
};

const getSongs: (page: number, query: Query) => Promise<SongData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/songs?${queryString}`,
    "GET"
  )) as SongData;
};

const getArtists: (page: number, query: Query) => Promise<ArtistData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/artists?${queryString}`,
    "GET"
  )) as ArtistData;
};

const getAlbums: (page: number, query: Query) => Promise<AlbumData> = async (
  page = 1,
  query = "recent"
) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/albums?${queryString}`,
    "GET"
  )) as AlbumData;
};

const getAlbumsByArtist = async (id: string, page: number, query: Query) => {
  const queryObject = new URLSearchParams({ page: page.toString(), query });
  const queryString = queryObject.toString();
  return (await fetchData(
    `${BASE_URL}/albums/artist/${id}?${queryString}`,
    "GET"
  )) as AlbumData;
};

const getAlbumById: (id: string) => Promise<AlbumDocument> = async (
  id: string
) => {
  return (await fetchData(`${BASE_URL}/albums/${id}`, "GET")) as AlbumDocument;
};

const getArtist = async (id: string) => {
  return await fetchData(`${BASE_URL}/artists/${id}`, "GET");
};

const playSong = async (id: string) => {
  console.log("playing song", id);
  return await fetchData(`${BASE_URL}/songs/${id}/play`, "POST");
};

const getSongById = async (id: string) => {
  return await fetchData(`${BASE_URL}/songs/${id}`, "GET");
};

export default {
  songs: {
    get: {
      one: getSongById,
      all: getSongs,
    },
    upload: uploadSongs,
    // create: createMedia,
    // update: updateMedia,
    // delete: deleteMedia,
    play: playSong,
  },
  artists: {
    get: {
      all: getArtists,
      one: getArtist,
    },
  },
  albums: {
    get: {
      all: getAlbums,
      one: getAlbumById,
      artist: getAlbumsByArtist,
    },
  },
};
