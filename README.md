# Tracking-Parking — Web (tracking-parking-web)

React + Vite + MUI 製の公開ビューア。各駐車場の現在台数（`現在 / 定員`）を5秒ごとに自動更新して
表示するだけの画面で、ログインや操作系エンドポイントは一切持たない。不特定多数に公開しても
操作系エンドポイントに誤って触れる心配がない。

台数の手動増減は [manager](https://github.com/NUTFes/tracking-parking-manager)
（実行委員のGoogleアカウントでサインインが必要）、駐車場・デバイスの登録やリセットなど、より
強い操作権限が要る機能は [admin-web](https://github.com/NUTFes/tracking-parking-admin-web) の担当。

[tracking-parking-center](https://github.com/NUTFes/tracking-parking-center) から
`services/web` としてcloneして使う想定（プロジェクト全体のセットアップ手順はそちらを参照）。

## フロントエンド開発

```bash
cp .env.example .env   # VITE_API_BASE_URL（既定: http://localhost:8000）
npm install
npm run dev      # http://localhost:5173
npm run build    # 型チェック + 本番ビルド
```

`manager`・`admin-web` とは別々の Vite プロジェクトで、`src/api` 配下のAPIクライアントなどの
コードは意図的に重複させている（3画面だけの規模でモノレポの共有パッケージ化をするほどでは
ないため）。API のレスポンス型を変更した場合は他の2つにも反映すること。

## License

MIT License. 詳細は [LICENSE](LICENSE) を参照。
