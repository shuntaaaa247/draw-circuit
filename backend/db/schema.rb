# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_08_21_155838) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "circuit_elements", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "element_type", null: false
    t.decimal "x_position", precision: 10, scale: 2
    t.decimal "y_position", precision: 10, scale: 2
    t.decimal "width", precision: 10, scale: 2
    t.decimal "height", precision: 10, scale: 2
    t.decimal "rotation", precision: 5, scale: 2
    t.jsonb "properties", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "start_x_position", precision: 10, scale: 2
    t.decimal "start_y_position", precision: 10, scale: 2
    t.decimal "end_x_position", precision: 10, scale: 2
    t.decimal "end_y_position", precision: 10, scale: 2
    t.index ["element_type"], name: "index_circuit_elements_on_element_type"
    t.index ["project_id"], name: "index_circuit_elements_on_project_id"
    t.index ["properties"], name: "index_circuit_elements_on_properties", using: :gin
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "circuit_elements", "projects"
  add_foreign_key "projects", "users"
end
