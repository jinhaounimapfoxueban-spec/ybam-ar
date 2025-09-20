import { useState } from 'react';
import Head from 'next/head';

export default function Admin() {
  return (
    <div>
      <Head>
        <title>管理后台 - AR项目管理系统</title>
      </Head>

      <header>
        <h1>项目管理后台</h1>
        <button>退出登录</button>
      </header>

      <main>
        <button>创建新项目</button>
        <p>项目列表加载中...</p>
      </main>
    </div>
  );
}
