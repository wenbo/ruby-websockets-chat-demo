require 'sinatra/base'
require "sinatra/reloader"

module ChatDemo
  class App < Sinatra::Base
    configure :development do
      register Sinatra::Reloader
    end

    get "/" do
      erb :"index.html"
    end

    get "/assets/js/application.js" do
      content_type :js
      @scheme = ENV['RACK_ENV'] == "production" ? "wss://" : "ws://"
      erb :"application.js"
    end
  end
end
