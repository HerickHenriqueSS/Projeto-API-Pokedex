
const express = require("express");
const cors = require("cors");


//                  Requisisção do Banco de Dados MySQL
const db = require('./conexao');


//                  Rotas
const rotas = express.Router();


//                  Rota principal
rotas.get("/", (req, res) =>{
    res.send("Rota inicial do servidor");
})


//                  Pesquisa retorna todos os Pokemons
rotas.get("/pokemons", async (req, res) =>{
    try{
        pokemon = await db.query(    
            `SELECT * from pokemon order by pokemon.numero;`
        );
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }
    
    
})


//                  Pesquisa retorna todos os Pokemons
rotas.get("/pokemon/:limit/:page", async (req, res) =>{
    const limit = 20;                  //Puxa informação ":limit" da URL - limitado a 20 por padrão
    const page = req.params.page;      //Puxa informação ":page" da URL
    try{
        pokemon = await db.query(    
            `SELECT * from pokemon 
            LIMIT ${limit} OFFSET ${page*20} ;`
        );
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }
    
})


//                  Pesquisa retorna "NAME" do Pokemon escolhido
rotas.get("/pokemon/:nome", async(req, res) =>{
    const nome = req.params.nome;  
    try{
        pokemon = await db.query(
            `Select * from pokemon as p where p.nome 
            like "%${nome}";`
        );
        db.end();
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }
    
})

//                  Pesquisa retora o pokemon conforme o "NUMERO DA POKEDEX"
rotas.get("/pokemons/pokedex/:id", async(req, res) =>{
    const id = req.params.id;  
    try{
        pokemon = await db.query(
            `Select * from pokemon as p where p.id 
            like "%${id}%" LIMIT 1;`
        );
        db.end();
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }
    
})


//                  Pesquisa retorna todos os "TYPES" 
rotas.get("/types", async(req, res) =>{
    try{
        pokemon = await db.query(
            `SELECT nome from tipos;`
        );
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }    
})


//                  Pesquisa retorna o "TYPES" especificos
rotas.get("/types/:tipo/:limit/:page", async (req, res) =>{
    const limit = 20;
    const page = req.params.page;
    const tipo = req.params.tipo;
    try{
        pokemon = await db.query(
            `SELECT distinct p.*, t.nome as Tipo 
            from pokemon as p, tipos as t, pokemon_tipos as tp 
            where p.id = tp.pokemon_id and t.id = tp.tipo_id and t.nome 
            like "%${tipo}"
            order by p.numero 
            LIMIT ${limit} OFFSET ${page*20};`
        );
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }    
    
})


//                  Pesquisa retorna todas as "REGIONS"
rotas.get("/regions", async(req, res) =>{
    try{
        pokemon = await db.query(
            `SELECT nome from regioes;`
        );
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }    
})


//                  Pesquisa retorna a "REGIONS" escolhida
rotas.get("/regions/:regiao/:limit/:page", async (req, res) =>{
    const limit = 20;
    const page = req.params.page;
    const regiao = req.params.regiao;
    try{
        pokemon = await db.query(
            `SELECT distinct p.*  
            from pokemon as p, regioes as r 
            where p.geracao = r.id 
            and r.nome like "%${regiao}" 
            order by p.numero
            LIMIT ${limit} OFFSET ${page*20};`
        );
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }
    
})

//                  Pesquisa retorna as "EVOLUTION" do Pokemon escolhido
rotas.get("/evolution/:nome", async (req, res) =>{
    const nome = req.params.nome;
    try{
        pokemon = await db.query(
            `SELECT nome, evolucoes from pokemon as p 
            where p.nome 
            like "%${nome}";`
        );
        
        db.end()
        return res.status(200).json(pokemon);

    }catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Erro desconhecido" })
    }
    
})
 


//                  Configuração do servidor
const app = express();          

app.use(cors());                
app.use(express.json());        
app.use(rotas);                 

const port = 3333;

// Inicializando o servidor
app.listen(port, () => console.log(`Acesse http://localhost:${port}`));