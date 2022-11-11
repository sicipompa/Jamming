const clientID = '5725de66c1604b1ea503bef8e7b86fbd'
const redirectURI = "http://localhost:3000/"

let token;
const Spotify = {
    getAccessToken(){
        if(token){
            return token
        }
        //We check for access token match
        const accessToken = window.location.href.match(/access_token=([^&]*)/);
        const expiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (accessToken && expiresIn){
            token = accessToken;
            const expires = Number(expiresIn[1]);
            //Clear parameters when expiring date is reached
            window.setTimeout(() => token = '', expires * 1000);
            window.history.pushState('Access Token', null, '/');
            return token
        }
        else{
            const accessURI = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessURI
        }
    },
    
    search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {headers: {
            Authorization: `Bearer ${accessToken}`
        }}).then(response=> {
            return response.json
        }).then(jsonResponse =>{
            if(!jsonResponse.tracks){
                return []
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
            })
    },
    savePlaylist(playlistName, trackURIs){
        if(!playlistName || !trackURIs.length){
            return 
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}
        let userID;
        return fetch('https://api.spotify.com/v1/me',{
            headers: headers
        }).then(response=> {
            return response.json()
        }).then(jsonResponse =>{
            userID = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response =>{
                response.json()
            }).then(jsonResponse =>{
                const playlistID = jsonResponse.id
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                })
            })
        })}
}

export default Spotify