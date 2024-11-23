import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Select, Card, Row, Col, Upload } from 'antd';
import { UploadOutlined, LikeOutlined } from '@ant-design/icons';
import Sidebar from '../Layout/SideBar';
import { Header } from 'antd/es/layout/layout';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [posts, setPosts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(storedPosts);
  }, []);

  const savePostsToLocalStorage = (newPosts) => {
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const calculateRelativeTime = (createdAt) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now - postTime) / 60000);

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `há ${diffInMinutes} minutos`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} dias`;
  };

  const showModal = (index = null) => {
    setIsModalOpen(true);
    setEditingIndex(index);
    if (index !== null) {
      const postToEdit = posts[index];
      form.setFieldsValue({
        title: postToEdit.tema,
        subtitle: postToEdit.subtema,
        content: postToEdit.conteudo,
        image: postToEdit.imagem
          ? [{ url: postToEdit.imagem, thumbUrl: postToEdit.imagem }]
          : [],
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingIndex(null);
  };

  const handleCreateOrUpdatePost = () => {
    form
      .validateFields()
      .then((values) => {
        const newPost = {
          tema: values.title,
          subtema: values.subtitle,
          conteudo: values.content,
          imagem: values.image?.[0]?.thumbUrl || null,
          likes: editingIndex !== null ? posts[editingIndex].likes : 0,
          liked: editingIndex !== null ? posts[editingIndex].liked : false,
          createdAt:
            editingIndex !== null
              ? posts[editingIndex].createdAt
              : new Date().toISOString(),
        };

        const updatedPosts =
          editingIndex !== null
            ? posts.map((post, index) => (index === editingIndex ? newPost : post))
            : [...posts, newPost];

        setPosts(updatedPosts);
        savePostsToLocalStorage(updatedPosts);
        message.success(
          editingIndex !== null
            ? 'Post atualizado com sucesso!'
            : 'Post criado com sucesso!'
        );
        form.resetFields();
        setIsModalOpen(false);
        setEditingIndex(null);
      })
      .catch((info) => {
        console.error('Erro na validação:', info);
      });
  };

  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
    savePostsToLocalStorage(updatedPosts);
    message.success('Post excluído com sucesso!');
  };

  const handleLikePost = (index) => {
    const updatedPosts = [...posts];
    if (updatedPosts[index].liked) {
      message.info('Você já curtiu esse post!');
      return;
    }
    updatedPosts[index].likes += 1;
    updatedPosts[index].liked = true;
    setPosts(updatedPosts);
    savePostsToLocalStorage(updatedPosts);
  };

  const handleShowFullPost = (post) => {
    setExpandedPost(post);
  };

  const handleCloseFullPost = () => {
    setExpandedPost(null);
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div style={{ padding: '20px', marginLeft: '200px' }}>
        <Button type="primary" onClick={() => showModal()}>
          Adicionar Post
        </Button>

        <Modal
          title={editingIndex !== null ? 'Editar Post' : 'Adicionar Novo Post'}
          open={isModalOpen}
          onCancel={handleCancel}
          onOk={handleCreateOrUpdatePost}
          okText={editingIndex !== null ? 'Atualizar' : 'Criar'}
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
                ]}
              />
            </Form.Item>
            <Form.Item name="subtitle" label="Subtema">
              <Input placeholder="Digite o subtema do post" maxLength={100} />
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
            >
              <Upload listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        <Row gutter={[0, 16]} style={{ marginTop: '20px' }}>
          {posts.map((post, index) => (
            <Col xs={15} key={index}>
              <Card
                title={post.tema}
                bordered
                extra={
                  <>
                    <Button type="link" onClick={() => showModal(index)}>
                      Editar
                    </Button>
                    <Button type="link" danger onClick={() => handleDeletePost(index)}>
                      Excluir
                    </Button>
                  </>
                }
              >
                <p style={{ fontStyle: 'italic', color: 'gray', marginBottom: '10px' }}>
                  {post.subtema}
                </p>
                <p style={{ fontSize: '12px', color: 'gray', marginBottom: '10px' }}>
                  Criado {calculateRelativeTime(post.createdAt)}
                </p>
                {post.imagem && (
                  <img
                    src={post.imagem}
                    alt="Post"
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      marginBottom: '10px',
                    }}
                  />
                )}
                <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {post.conteudo.length > 500
                    ? `${post.conteudo.slice(0, 500)}...`
                    : post.conteudo}
                </p>
                {post.conteudo.length > 500 && (
                  <Button type="link" onClick={() => handleShowFullPost(post)}>
                    Ler mais
                  </Button>
                )}
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


        <Modal
          title={expandedPost?.tema}
          open={!!expandedPost}
          onCancel={handleCloseFullPost}
          footer={null}
        >
          <p style={{ fontStyle: 'italic', color: 'gray', marginBottom: '10px' }}>
            {expandedPost?.subtema}
          </p>
          <p>{expandedPost?.conteudo}</p>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
