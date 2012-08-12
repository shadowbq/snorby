class JobsController < ApplicationController

  before_filter :require_administrative_privileges

  def index
    @jobs = Snorby::Jobs.find.all
    @process = Snorby::Worker.process
    @worker = Snorby::Worker
    @setting = Setting
    @snorbyreachable = Snorby::reachable?
    
    respond_to do |format|
      format.html
      format.js
      format.xml  { render :xml => {:worker => @worker, :jobs => @jobs} }
      format.json  { render :json => {:worker => @worker, :jobs => @jobs} }
    end
  end

  def last_error
    @job = Snorby::Jobs.find.get(params[:id])
    render :layout => false
  end
  
  def handler
    @job = Snorby::Jobs.find.get(params[:id])
    render :layout => false
  end

  def log
    @job = Snorby::Jobs.find.get(params[:id])
    
    begin
      logfile = @job.handler.split("Jobs::")[1].split(" ")[0]
    rescue
      logfile = "handler"
    end
      
    @logtext = ""
    
    if File.exists?("log/#{logfile}.log") 
      @logtext = []
      File::Tail::Logfile.open("log/#{logfile}.log", :backward => 35, :return_if_eof => true) { |log| log.tail { |line| @logtext << line }}
      @logtext = @logtext.join("\n")
    else
      @logtext = "'log/#{logfile}.log' does not exists. Worker / Jobs might not be running in verbose mode."
    end
     
    render :layout => false
  end

  def show
    @job = Snorby::Jobs.find.get(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @job }
    end
  end

  def edit
    @job = Snorby::Jobs.find.get(params[:id])
  end

  def update
    @job = Snorby::Jobs.find.get(params[:id])

    respond_to do |format|
      if @job.update(params[:job])
        format.html { redirect_to(@job, :notice => 'Job was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @job.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @job = Snorby::Jobs.find.get(params[:id])
    
    if @job.blank?
      redirect_to jobs_url
    else
      @job.destroy
      respond_to do |format|
        format.html { redirect_to(jobs_url) }
        format.xml  { head :ok }
      end
    end
    
  end
end



