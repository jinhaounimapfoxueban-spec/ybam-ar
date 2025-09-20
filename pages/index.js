import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>AR项目管理系统</title>
        <meta name="description" content="马佛青文化委员会AR项目管理系统" />
      </Head>

      <header>
        <h1>AR项目管理系统</h1>
        <button>管理员登录</button>
      </header>

      <main>
        <div>
          <button>启动AR相机</button>
        </div>
      </main>
    </div>
  );
}
