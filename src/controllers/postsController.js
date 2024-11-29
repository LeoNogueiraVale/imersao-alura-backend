import {getTodosPosts, criarPost, atualizarPost} from "../models/postosModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts (req, res)  { // Rota GET para a URL "/posts".
  const posts = await getTodosPosts(); // Chama a função para buscar todos os posts.
  res.status(200).json(posts); // Envia os posts como resposta em formato JSON com status 200 (sucesso).
}; 

export async function postarNovoPost(req, res) {
  const novoPost = req.body;
  try{
    const  postCriado = await criarPost(novoPost);
    res.status(200).json(postCriado);
  }  catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro": "Falha na requisição"});
  }
}

export async function uploadImagem(req, res) {
  const novoPost = {
    descicao:"",
    imgUrl: req.file.originalname,
    alt: ""
  }
  try{
    const  postCriado = await criarPost(novoPost);
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
    fs.renameSync (req.file.path, imagemAtualizada);

    res.status(200).json(postCriado);
  } catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro": "Falha na requisição"});
  }    
}


export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
 
  try{
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descicao = await gerarDescricaoComGemini(imgBuffer);
    const post = {
      imgUrl: urlImagem,
      descicao: descicao,
      alt: req.body.alt
    }
    const  postCriado = await atualizarPost(id, post);
    res.status(200).json(postCriado);
  }  catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro": "Falha na requisição"});
  }
}
