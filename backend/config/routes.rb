Rails.application.routes.draw do
  namespace :api do # namespaceはURLやコントローラの階層を作成するためのもの /api/v1/... というURLになり、コントローラーもAPI::V1::配下のクラスが対象となる
    namespace :v1 do # namespaceはURLやコントローラの階層を作成するためのもの /api/v1/... というURLになり、コントローラーもAPI::V1::配下のクラスが対象となる
      post "register", to: "auth#register"
      post "login", to: "auth#login"

      resources :projects, only: [:index, :show, :create, :update, :destroy] do # resourcesはRESTfulなルーティングを自動的に生成するためのもの、onlyで指定したアクションのみを生成する
        # ↑↑onlyに指定したアクションをよしなに生成してくれる
        # 具体的には以下のようなルーティングが生成される
        # GET /api/v1/projects → api/v1/projects_controller.rbのindexアクション
        # POST /api/v1/projects → api/v1/projects_controller.rbのcreateアクション
        # GET /api/v1/projects/:id → api/v1/projects_controller.rbのshowアクション
        # PATCH /api/v1/projects/:id → api/v1/projects_controller.rbのupdateアクション
        # DELETE /api/v1/projects/:id → api/v1/projects_controller.rbのdestroyアクション
        # GET /api/v1/projects/new → api/v1/projects_controller.rbのnewアクション (今回は生成しない)
        # GET /api/v1/projects/:id/edit → api/v1/projects_controller.rbのeditアクション (今回は生成しない)
         
        # resources :<コントローラ名(親←一)> とすると上のようなルーティングが生成されるが、
        # さらにdo~endで新たにresouces :<コントローラ名(子←多)>を囲むと以下のようなネストされたルーティングを生成できる
        
        resources :circuit_elements, only: [:create, :update, :destroy] # resourcesはRESTfulなルーティングを自動的に生成するためのもの
        # ↑↑具体的には以下のようなルーティングが生成される
        # POST /api/v1/projects/:project_id/circuit_elements → api/v1/circuit_elements_controller.rbのcreateアクション
        # PATCH /api/v1/projects/:project_id/circuit_elements/:id → api/v1/circuit_elements_controller.rbのupdateアクション
        # DELETE /api/v1/projects/:project_id/circuit_elements/:id → api/v1/circuit_elements_controller.rbのdestroyアクション
      end

    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
