class Api::V1::ProjectsController < ApplicationController
  before_action :authenticate_user # ここでのメソッドの引数はメソッドそのものではなく、メソッド名のシンボル
  before_action :set_project, only: [:show, :update, :destroy] # onlyでこのbefore_actionはshow, update, destroyアクションの前のみに適用される

  def index
    projects = current_user.projects # current_userはApplicationControllerのメソッド
    # projects.map(&:circuit_data)はprojects.map { |project| project.circuit_data }と同じ意味
    render json: projects.map(&:circuit_data) # circuit_dataはProjectモデルのメソッド projectが1件の場合は{...}で、複数件の場合は[{...}, {...}, ...]で返される
  end

  def show
    render json: @project.circuit_data
  end

  def create
    project = current_user.projects.build(project_params) # buildは新しいインスタンスを作成するメソッド
    if project.save
      # project.circuit_dataはapp/models/project.rbのcircuit_dataメソッドを呼び出している
      render json: project.circuit_data, status: :created # シンボルcreatedは201 Createdを表す
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity # シンボルunprocessable_entityは422 Unprocessable Entityを表す。422はバリデーションエラーを表す
    end
  end

  def update
    if @project.update(project_params)
      render json: @project.circuit_data
    else
      render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
    head :no_content # 204 No Contentを表す、ヘッダーのみを返す
  end

  private

  def set_project
    @project = current_user.projects.find(params[:id])
  end

  def project_params
    # クライアントから
    # {
    #   project: {
    #     name: "...",
    #     description: "...",
    #   }
    # }
    # というJSONが送信された場合、params.require(:project).permit(:name, :description)は
    # {
    #   name: "...",
    #   description: "...",
    # }
    # というハッシュを返す
    params.require(:project).permit(:name, :description)
  end
end
