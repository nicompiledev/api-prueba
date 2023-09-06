import React from 'react';
import { Layout } from 'antd';
import FileList from '../components/FileList';




const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#2c3e50', // Color de fondo del encabezado (Header)
  color: 'white', // Color de texto del encabezado
  fontSize: '24px',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: '#ecf0f1', // Color de fondo del contenido principal
  overflow: 'auto',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#2c3e50', // Color de fondo del pie de página (Footer)
  color: 'white', // Color de texto del pie de página
};

const AntDesignLayout: React.FC = () => (
  <div className="AntDesignLayout">
    <Layout style={{ height: '100vh' }}>
      <Header style={headerStyle}>
        Consumo API - React UI
      </Header>
      <Content style={contentStyle}>
        <FileList />
      </Content>
      <Footer style={footerStyle}>
        Desarrollado por{' '}
        <a
          href="https://github.com/nicompiledev"
          target="_blank"
          rel="noopener noreferrer"
          
        >
          @nicompiledev
          
        </a>
      </Footer>
    </Layout>
  </div>
);

export default AntDesignLayout;
