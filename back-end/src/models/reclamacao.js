const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

class ReclamacaoModel {
  static async getAll() {
    return await getDB().collection('reclamacoes').find().toArray();
  }

  static async getById(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return await getDB().collection('reclamacoes').findOne({ _id: new ObjectId(id) });
  }

  static async getByStatus(status) {
    return await getDB().collection('reclamacoes').find({ status: status }).toArray();
  }

  static async create(reclamacaoData) {
    const result = await getDB().collection('reclamacoes').insertOne({
      categoria: reclamacaoData.categoria,  // Categoria da reclamação (ex: "Lixo na rua")
      status: 'Pendente',  // Status inicial da reclamação
      nomePessoa: reclamacaoData.nome,  // Nome da pessoa que fez a reclamação
      enderecoReclamacao: {  // Endereço detalhado da reclamação
        rua: reclamacaoData.endereco.rua,
        numero: reclamacaoData.endereco.numero,
        bairro: reclamacaoData.endereco.bairro,
        cidade: reclamacaoData.endereco.cidade,
        estado: reclamacaoData.endereco.estado,
        pais: reclamacaoData.endereco.pais || 'Brasil' // Valor padrão
      },
      descricaoReclamacao: reclamacaoData.descricao,  // Descrição da reclamação
      autoridadeResponsavel: reclamacaoData.autoridadeResponsavel || '',  // Autoridade responsável
      resposta: null,  // Resposta da autoridade, inicialmente vazia
      dataCriacao: new Date(),  // Data de criação
      dataAtualizacao: new Date()  // Data de última atualização
    });

    if (result.acknowledged) {
      return await this.getById(result.insertedId);
    }
    return null;
  }

  static async update(id, reclamacaoData) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    // Este é o objeto que será usado para atualizar os dados
    const updateData = {};
    
    // Atualizamos apenas os campos fornecidos
    if (reclamacaoData.categoria) updateData.categoria = reclamacaoData.categoria;
    if (reclamacaoData.status) updateData.status = reclamacaoData.status;
    
    // Se tiver o campo nome, atualizamos nomePessoa
    if (reclamacaoData.nome) updateData.nomePessoa = reclamacaoData.nome;
    
    // Se tiver o campo descricao, atualizamos descricaoReclamacao
    if (reclamacaoData.descricao) updateData.descricaoReclamacao = reclamacaoData.descricao;
    
    // Atualiza a autoridade responsável se fornecida
    if (reclamacaoData.autoridadeResponsavel !== undefined) {
      updateData.autoridadeResponsavel = reclamacaoData.autoridadeResponsavel;
    }
    
    // Atualiza a resposta se fornecida
    if (reclamacaoData.resposta !== undefined) {
      updateData.resposta = reclamacaoData.resposta;
    }
    
    // Se tiver o objeto endereco, atualizamos o enderecoReclamacao
    if (reclamacaoData.endereco) {
      updateData.enderecoReclamacao = {
        rua: reclamacaoData.endereco.rua,
        numero: reclamacaoData.endereco.numero,
        bairro: reclamacaoData.endereco.bairro,
        cidade: reclamacaoData.endereco.cidade,
        estado: reclamacaoData.endereco.estado,
        pais: reclamacaoData.endereco.pais || 'Brasil'
      };
    }
    
    // Sempre atualizamos a data de atualização
    updateData.dataAtualizacao = new Date();

    const result = await getDB().collection('reclamacoes').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount > 0) {
      return await this.getById(id);
    }
    return null;
  }

  static async delete(id) {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await getDB().collection('reclamacoes').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = ReclamacaoModel;