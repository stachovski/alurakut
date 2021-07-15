import { useEffect, useState } from "react";
import Box from "../components/Box";
import MainGrid from "../components/MainGrid";
import ProfileRelations from "../components/ProfileRelations";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from "../lib/AluraCommons";

const followersURL = "https://api.github.com/users/stachovski/followers";
const githubUser = "stachovski";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getGitFollowers(followersURL, setFollowers) {
  fetch(followersURL)
    .then((resposta) => {
      return resposta.json();
    })
    .then((json) => {
      setFollowers(
        json.map((follower) => {
          return {
            id: follower.id,
            title: follower.login,
            image: follower.avatar_url,
            href: follower.html_url,
          };
        })
      );
    });
}

function ProfileSideBar(propriedades) {
  return (
    <Box as="aside">
      <img
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

export default function Home() {
  const [comunidades, setComunidades] = useState([]);
  const [pessoasFavoritas, setFollowers] = useState([]);
  
  useEffect(() => {
    getGitFollowers(followersURL, setFollowers);
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
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCommunity(e) {
                e.preventDefault();

                const formData = new FormData(e.target);

                const comunidade = {
                  title: formData.get("title"),
                  image: formData.get("image"),
                };
                setComunidades([comunidade, ...comunidades]);
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
            itens={pessoasFavoritas}
          />

          <ProfileRelations
            title="Comunidades"
            seeAllLink={`#`}
            itens={comunidades}
          />

          <ProfileRelations
            title="Pessoas da Comunidade"
            seeAllLink={`#`}
            itens={[]}
          />
        </div>
      </MainGrid>
    </>
  );
}
