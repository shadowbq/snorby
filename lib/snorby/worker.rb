# Snorby - All About Simplicity.
# 
# Copyright (c) 2010 Dustin Willis Webber (dustin.webber at gmail.com)
# 
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

module Snorby
  
  class Worker < Struct.new(:action)

    @@pid_path = "#{Rails.root}/tmp/pids"
    
    @@pid_file = "#{Rails.root}/tmp/pids/delayed_job.pid"

    def perform
      
      case action.to_sym
      when :start
        self.start
      when :stop
        self.stop
      when :restart
        self.restart
      when :zap
        self.zap
      end
      
    end

    def self.problems?
      worker_and_caches = (!Snorby::Worker.running? || !Snorby::Jobs.sensor_cache? || !Snorby::Jobs.daily_cache?)
      Setting.geoip? ? ( worker_and_caches || !Snorby::Jobs.geoip_update?) : worker_and_caches
    end

    def self.process
      if Snorby::Worker.pid
        Snorby::Process.new(`ps -o ruser,pid,%cpu,%mem,vsize,rss,tt,stat,start,etime,command -p #{Snorby::Worker.pid} |grep delayed_job |grep -v grep`.chomp.strip)
      else
        if self.pid
          Snorby::Process.new(`ps -o ruser,pid,%cpu,%mem,vsize,rss,tt,stat,start,etime,command -p #{self.pid} |grep delayed_job |grep -v grep`.chomp.strip)
        end
      end
    end

    def self.pid_path
      @@pid_path
    end

    def self.pid_file
      @@pid_file
    end

    def self.pid
      File.open(@@pid_file).read.to_i if File.exists?(@@pid_file)
    end

    def self.running?
      return true if File.exists?(@@pid_file) && !Snorby::Worker.process.raw.empty?
      false
    end
    
    def self.start
      `RAILS_ENV=#{Rails.env} #{Rails.root}/script/delayed_job start --pid-dir #{@@pid_path}`
    end
    
    def self.stop
      `RAILS_ENV=#{Rails.env} #{Rails.root}/script/delayed_job stop --pid-dir #{@@pid_path}`
    end

    def self.restart
      `RAILS_ENV=#{Rails.env} #{Rails.root}/script/delayed_job restart --pid-dir #{@@pid_path}`
    end
    
    def self.zap
      `RAILS_ENV=#{Rails.env} #{Rails.root}/script/delayed_job zap --pid-dir #{@@pid_path}`
    end

  end
  
end
