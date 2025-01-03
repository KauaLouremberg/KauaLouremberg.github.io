import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Input, message, Select, Card, Row, Col, Upload, Switch, Divider } from 'antd';
import { UploadOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons';
import HeaderLayout from '../Layout/HeaderLayout';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [posts, setPosts] = useState([]);
  const postRefs = useRef({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (searchTerm) => {
    console.log("Search triggered with term:", searchTerm);
    setSearchTerm(searchTerm);
    const matchingPost = posts.find(
      (post) =>
        (post.tema && post.tema.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.subtema &&
          post.subtema.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
    if (matchingPost) {
      const postElement = postRefs.current[matchingPost.id];
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        message.error("Erro ao localizar o elemento correspondente.");
      }
    } else {
      message.info("Nenhuma postagem encontrada.");
    }
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
          id: editingIndex !== null ? posts[editingIndex].id : Date.now(),
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
          creator: values.criador,
          anonimo: values.anonimo || false,  // Armazenando a opção Anônimo na postagem
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
      <HeaderLayout onSearch={handleSearch} />
      <div style={{ padding: '20px', marginLeft: '1px' }}>
        <Button type="primary" onClick={() => showModal()} style={{backgroundColor: "#FAA958"}}>
          Adicionar Post
        </Button>

        <Divider />

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
                  { value: 'Amazônia', label: 'Amazônia' },
                  { value: 'Cerrado', label: 'Cerrado' },
                  { value: 'Caatinga', label: 'Caatinga' },
                  { value: 'Pampa', label: 'Pampa' },
                  { value: 'Pantanal', label: 'Pantanal' },
                  { value: 'Mata Atlântica', label: 'Mata Atlântica' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="criador"
              label="Criador"
              rules={[{ required: true, message: 'O Criador é obrigatório!' }]}
            >
              <Input name="criador" type="text" maxLength={50} />
            </Form.Item>

            <Form.Item
              name="anonimo"
              label="Anônimo?"
              valuePropName="checked"
            >
              <Switch />
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
              <div ref={(el) => (postRefs.current[post.id] = el)}>
              <Card
                title={post.tema}
                bordered  
                style={{
                  border: searchTerm &&
                    (post.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      post.subtema.toLowerCase().includes(searchTerm.toLowerCase()))
                    ? "2px solid #FAA958"
                    : "1px solid #d9d9d9",
                }}
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
                <p style={{ fontStyle: 'italic', color: 'gray', marginBottom: '10px', display: "flex" }}>
                  <UserOutlined style={{marginRight: "10px"}} /> {post.anonimo ? 'Anônimo' : post.creator || 'Criador não informado'}
                </p>
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
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {expandedPost && (
        <Modal
          title="Post Completo"
          open={expandedPost !== null}
          onCancel={handleCloseFullPost}
          footer={null}
        >
          <h2>{expandedPost.tema}</h2>
          <p>{expandedPost.subtema}</p>
          <p>{expandedPost.conteudo}</p>
          {expandedPost.imagem && (
            <img
              src={expandedPost.imagem}
              alt="Imagem do Post"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
