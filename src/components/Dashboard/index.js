import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Select, Card, Row, Col, Upload } from 'antd';
import { UploadOutlined, LikeOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(storedPosts);
  }, []);

  const savePostsToLocalStorage = (newPosts) => {
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Limpa os campos ao fechar o modal
  };

  const handleCreatePost = () => {
    form
      .validateFields()
      .then((values) => {
        const temaSelecionado = values.title;

        const newPost = {
          tema: temaSelecionado, 
          subtema: values.subtitle, 
          conteudo: values.content,
          imagem: values.image ? values.image[0].thumbUrl : null,
          likes: 0, 
          liked: false, 
        };

        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts); 
        savePostsToLocalStorage(updatedPosts);
        message.success('Post criado com sucesso!');
        form.resetFields(); 
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.error('Erro na validação:', info);
      });
  };

  // Função para curtir um post
  const handleLikePost = (index) => {
    const updatedPosts = [...posts];
    
    // Verifica se o post já foi curtido
    if (updatedPosts[index].liked) {
      message.info('Você já curtiu esse post!');
      return;
    }

    // Se não foi curtido, incrementa o contador de curtidas e marca como curtido
    updatedPosts[index].likes += 1; // Incrementa o contador de curtidas
    updatedPosts[index].liked = true; // Marca o post como curtido
    
    setPosts(updatedPosts); // Atualiza os posts
    savePostsToLocalStorage(updatedPosts); // Salva no LocalStorage
  };

  // Função para excluir um post
  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index); // Remove o post pelo índice
    setPosts(updatedPosts); // Atualiza a lista de posts
    savePostsToLocalStorage(updatedPosts); // Salva no LocalStorage
    message.success('Post excluído com sucesso!');
  };

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <Button type="primary" onClick={showModal}>
          Adicionar Post
        </Button>

        <Modal
          title="Adicionar Novo Post"
          open={isModalOpen}
          onCancel={handleCancel}
          onOk={handleCreatePost}
          okText="Criar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Tema"
              rules={[{ required: true, message: 'O Tema é obrigatório!' }]}
            >
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Buscar Tema"
                optionFilterProp="label"
                options={[
                  { value: 'Biomas', label: 'Biomas' },
                  { value: 'Teste2', label: 'Teste2' },
                  { value: 'Teste3', label: 'Teste3' },
                  { value: 'Teste4', label: 'Teste4' },
                  { value: 'Teste5', label: 'Teste5' },
                  { value: 'Teste6', label: 'Teste6' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="subtitle"
              label="Subtema"
              rules={[{ required: false }]}
            >
              <Input placeholder="Digite o subtema do post" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Conteúdo"
              rules={[{ required: true, message: 'O conteúdo é obrigatório!' }]}
            >
              <Input.TextArea rows={4} placeholder="Digite o conteúdo do post" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Imagem"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: false }]}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false} // Evita upload automático
              >
                <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Lista de posts exibida em cards */}
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {posts.map((post, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                title={post.tema}
                bordered
                extra={
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDeletePost(index)}
                  >
                    Excluir
                  </Button>
                }
                style={{ wordWrap: 'break-word' }}
              >
                <p style={{ fontStyle: 'italic', color: 'gray', marginBottom: '10px' }}>
                  {post.subtema}
                </p>
                {post.imagem && (
                  <img
                    src={post.imagem}
                    alt="Post"
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                )}
                <p style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                  {post.conteudo}
                </p>
                <Button
                  type="link"
                  icon={<LikeOutlined />}
                  onClick={() => handleLikePost(index)}
                  disabled={post.liked}
                >
                  Curtir ({post.likes})
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
