import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
var request = require("request");
var axios = require("axios").default;

function App() {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <div className="App">
      <LoginButton/>
      <LogoutButton/>
      <Profile/>
      <TestButton/>
      <GetTokenButton/>
    </div>
  );
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const GetTokenButton = () => {
  const test = () => {
    var options = { method: 'POST',
      url: 'https://dev-pkkepqar.eu.auth0.com/oauth/token',
      headers: { 'content-type': 'application/json' },
      body: '{"client_id":"t7epBhgkKfV8sxF2s7GDZTv5C7Wzza1B","client_secret":"ez2QvFFRv0AwQeQ4j8JE8XlsL6pGU8oGFTyJjAcOoOR06soNUfj-B4A0NSp1siS7","audience":"kruchuverchu.com","grant_type":"client_credentials"}' };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  }
  return (<button onClick={()=>{test()}}>Get Token Manualy</button>)
}

const TestButton = () => {
  const { getAccessTokenSilently } = useAuth0();
  const test = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
          audience: `kruchuverchu.com`,
          scope: "read:current_user",
        });
      console.log("ACCESS TOKEN: ", accessToken);
      const domain = "localhost:4000";
      const url = `http://${domain}/api/private-scoped`;

      var options = { method: 'GET', url, headers: { authorization: `Bearer ${accessToken}` } };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log("RESPONSE: ",body);
      });

    }
    catch (e){
      console.log("ERROR: ", e)
    }
  }
  return (<button onClick={()=>{test()}}>Test</button>)
}

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-pkkepqar.eu.auth0.com";
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { user_metadata } = await metadataResponse.json();
        setUserMetadata(user_metadata);
      } catch (e) {
        console.log("CATCH: ",e.message);
      }
    };
    if(user){
      getUserMetadata();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default App;
