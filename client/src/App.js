import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
var request = require("request");

function App() {
  return (
    <div className="App">
      <LoginButton/>
      <LogoutButton/>
      <Profile/>
      <TestButton/>
      <SendRequest/>
    </div>
  );
}

const TestButton = () => {
  const test = () => {
    var options = { method: 'POST',
    url: 'https://dev-pkkepqar.eu.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"C7VYzWpW1VRAO6CuOWomd1i3w1st0Xnh","client_secret":"GJBTmapYEUHbQCr57_1E1-FjJekNukBYWfDhYqsUprgpWY-1ClWNFIZDaCLzBe_K","audience":"kruchuverchu.com","grant_type":"client_credentials"}' };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  }
  return <button onClick={() => test()}>GetToken</button>
}

const SendRequest = () => {
  const test = () => {
    var options = { method: 'GET',
      url: 'http://localhost:4000/api/private',
      headers: { authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Inh5cHdtUGtkdzQ0U2xyU1dNWHJHUiJ9.eyJpc3MiOiJodHRwczovL2Rldi1wa2tlcHFhci5ldS5hdXRoMC5jb20vIiwic3ViIjoiREdIRGJDeW9maXBodEU3NTNyd1lMa2tzY1VOYXZHQmJAY2xpZW50cyIsImF1ZCI6ImtydWNodXZlcmNodS5jb20iLCJpYXQiOjE2MDM4MDg3OTQsImV4cCI6MTYwMzg5NTE5NCwiYXpwIjoiREdIRGJDeW9maXBodEU3NTNyd1lMa2tzY1VOYXZHQmIiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.JupGpOdkMPCEhmor8BP7xWrQZXKQ6CnD8AXahfRt5r_Qxu968nogdvxvuZVU1qYy2g7GFlFewHpxZG_d8KaDj_soClHQW-I2S0EFwESGVDdlDDprLcTD2uAylIFKz-SVPoe0iDSmXzFg4qkUqsN1Ds7_jJdVwXhlrzjndqVnGOKgEciclO7WadCO-l5nc4lnBTFDeFZFm3nS8ywJdX0K8qEga37-0Ja3m5OKTChJqVBQSzDMVLmIoklyzM1AzSLGQTgYME4j_GQYJAlcTwllFbYWc2IcNjwYc70gt1lSYmRX3ME2wQrFKqu8rEYWXbyW5_-RoI-_EA88barCyOHPSQ' } };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });
  }
  return <button onClick={() => test()}>SendRequest</button>
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
