FROM ruby:3.2.2

# apt-get update -qq：パッケージリストを更新（-qqは静寂モード）
# nodejs：JavaScriptランタイム（Railsのアセットパイプラインで必要）
# postgresql-client：PostgreSQLデータベースに接続するためのクライアントツール
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR /app

# ホストマシンのGemfileとGemfile.lockをコンテナ内の/appディレクトリにコピー。
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

# Gemfileに記載されたRubyの依存関係（gem）をインストール。
RUN bundle install

# アプリケーションのソースコードをコピー
COPY . .

# ホストマシンのentrypoint.shをコンテナ内の/usr/bin/にコピー。
COPY entrypoint.sh /usr/bin/

# コピーしたentrypoint.shを実行権限を付与。
RUN chmod +x /usr/bin/entrypoint.sh

# コンテナ起動時に必ず実行されるスクリプトを指定
ENTRYPOINT ["entrypoint.sh"]

# コンテナの4000番ポートを外部に公開。
EXPOSE 4000

# rails server：Railsサーバーを起動
# -b 0.0.0.0：すべてのネットワークインターフェースでリッスン（外部（ホスト）からのアクセスを許可）
CMD ["rails", "server", "-b", "0.0.0.0"]