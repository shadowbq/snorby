class NotesController < ApplicationController
  
  before_filter :require_administrative_privileges, :only => [:index, :destroy, :edit, :update]
  before_filter :find_event, :only => [:create, :new]
  
  def find_event
    @event = Event.get(params[:sid], params[:cid])
    @user = User.current_user
  end
  
  def index
    @notes = Note.all.page(params[:page].to_i, :per_page => @current_user.per_page_count, :order => [:id.desc])
    @show_alert = true
  end
  
  def new
  end
  
  def create
    @note = @event.notes.create({ :user => @user, :body => params[:body] })
    if @note.save
      Delayed::Job.enqueue(Snorby::Jobs::NoteNotification.new(@note.id))
    end
  end
  
  def show
  end
  
  def edit
    @note = Note.get(params[:id])
  end
  
  def update
    @note = Note.get(params[:id])
    if @note.update(params[:id])
      
    end
  end
  
  def destroy
    @note = Note.get(params[:id])
    @event = @note.event
    @note.destroy
  end

end
