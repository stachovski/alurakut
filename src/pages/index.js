import jwt from "jsonwebtoken";
import nookies from "nookies";
import { useEffect, useState } from "react";
import Box from "../components/Box";
import MainGrid from "../components/MainGrid";
import ProfileRelations from "../components/ProfileRelations";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../lib/AluraCommons";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getGitInfo(url, setFunction) {
  fetch(url)
    .then((resposta) => resposta.json())
    .then((json) => {
      setFunction(
        json.map((item) => {
          return {
            id: item.id,
            title: item.login,
            image: item.avatar_url,
            href: item.html_url,
          };
        })
      );
    });
}

function getCommunities(setFunction) {
  const search = { type: "972033" };

  fetch("/api/getCommunities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(search),
  }).then(async (response) => {
    const dados = await response.json();
    const communities = dados.record;
    setFunction(communities);
  });
}

function ProfileSideBar(propriedades) {
  return (
    <Box as="aside">
      <img
        alt="profile-picture"
        src={`https://github.com/${propriedades.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />

      <p>
        <a
          className="boxLink"
          href={`https://github.com/${propriedades.githubUser}`}
        >
          @{propriedades.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function HomePage(props) {
  const githubUser = props.githubUser;
  const followersURL = `https://api.github.com/users/${githubUser}/followers`;
  const followingURL = `https://api.github.com/users/${githubUser}/following`;
  const [communities, setCommunities] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    getGitInfo(followersURL, setFollowers);
    getGitInfo(followingURL, setFollowing);
    getCommunities(setCommunities);
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet
              recados={getRandomInt(1, 100)}
              fotos={getRandomInt(1, 100)}
              videos={getRandomInt(1, 100)}
              fas={getRandomInt(1, 20)}
              mensagens={getRandomInt(1, 100)}
              confiavel={getRandomInt(1, 3)}
              legal={getRandomInt(1, 3)}
              sexy={getRandomInt(1, 3)}
            />
          </Box>
          <Box>
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
            <form
              onSubmit={function handleCommunity(e) {
                e.preventDefault();

                const formData = new FormData(e.target);

                const community = {
                  title: formData.get("title"),
                  image: formData.get("image"),
                };

                fetch("/api/createCommunity", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify(community),
                }).then(async (response) => {
                  const dados = await response.json();
                  const community = dados.record;
                  setCommunities([community, ...communities]);
                });
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelations
            title="Followers"
            seeAllLink={followersURL}
            itens={followers}
          />

          <ProfileRelations
            title="Comunidades"
            seeAllLink={`#`}
            itens={communities}
          />

          <ProfileRelations
            title="Voc?? est?? seguindo"
            seeAllLink={followingURL}
            itens={following}
          />
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((resposta) => resposta.json());

 

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);

  const isTrueUser = await fetch(`https://github.com/${githubUser}`).then(
    async (resposta) => (resposta.status === 404 ? false : true)
  );

  if (!isTrueUser) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      githubUser,
    },
  };
}
