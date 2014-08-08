# Snorby

* [snorby.org](http://www.snorby.org)
* [github.com/Snorby/snorby](http://github.com/Snorby/snorby/)
* [github.com/Snorby/snorby/issues](http://github.com/Snorby/snorby/issues)
* [github.com/Snorby/snorby/wiki](http://github.com/Snorby/snorby/wiki)
* irc.freenode.net #snorby

## Description

Snorby is a ruby on rails web application for network security monitoring that interfaces with current popular intrusion detection systems (Snort, Suricata and Sagan). The basic fundamental concepts behind Snorby are **simplicity**, organization and power. The project goal is to create a free, open source and highly competitive application for network monitoring for both private and enterprise use.

## Demo

URL: [http://demo.snorby.org](http://demo.snorby.org)

User: demo@snorby.org

Pass: snorby

**NOTE** For the full packet capture HTTP basic AUTH use the same credentials.

## Requirements

* Snort
* Ruby >= 1.9.2
* Rails = 3.1.12

## Install

* Get Snorby from the download section or use the latest edge release via git.

	`git clone git://github.com/Snorby/snorby.git`

* Move into the snorby Directory

	`cd snorby`

* Set File Permissions	

	The user who runs Snorby must have write permission on the following subdirectories:  log, tmp.

	Assuming you run Snorby with a www-data user:

	`sudo chown -R www-data:www-data log tmp` 
	
	`sudo chmod -R 755 log tmp` 
	

* Install Gem Dependencies  (make sure you have bundler installed: `gem install bundler`)

	`$ bundle install`
	
	* NOTE: If you get missing gem issues in production use `bundle install --deployment`
	
		If you have run `bundle package`, the gems wil be cached in 'vendor/cache' and will be used automatically. 

	* If your system gems are updated beyond the gemfile.lock you should use as an example `bundle exec rake snorby:setup` 

	* If running `bundle exec {app}` is painful you can safely install binstubs by `bundle install --binstubs` 
	
* Install wkhtmltopdf

	`pdfkit --install-wkhtmltopdf # If this fails - visit http://code.google.com/p/wkhtmltopdf/ for more information`

* Create Mysql User & Initial Authentication
	
	`mysql -u root -p`

	`mysql> create user 'snorby'@'localhost' identified by 'sn0rbys3cr3t';`
	
	`mysql> grant all privileges on snorby.* to 'snorby'@'localhost';`

* Copy the Snorby Configuration File Examples

	`cp config/snorby_config.yml.example config/snorby_config.yml`
	`cp config/database.yml.example config/database.yml`

* Fill out settings for config/database.yml && config/snorby_config.yml

	`vi config/snorby_config.yml`
	`vi config/database.yml`
	
* Run The Snorby Setup

	`RAILS_ENV=production bundle exec rake snorby:setup`

* Edit The Snorby Mail Configurations

	`config/initializers/mail_config.rb`
	
* Once all options have been configured and snorby is up and running

	* Make sure you start the Snorby Worker from the Administration page.
	* Make sure that both the `DailyCache` and `SensorCache` jobs are running.
	
* Default User Credentials

	* E-mail: **snorby@snorby.org**
	* Password: **snorby**
	
* NOTE - If you do not run Snorby with passenger (http://www.modrails.com) people remember to start rails in production mode.

	`rails -e production`
	
## Updating Snorby

In the root Snorby directory type the following command:

	`git pull origin master`
	
Once the pull has competed successfully run the Snorby update rake task:

	`rake snorby:update`
	
# Helpful Commands

You can open the rails console at anytime and interact with the Snorby environment. Below are a few helpful commands that may be useful:

 * Open the rails console by typing `rails c` in the Snorby root directory
 * You should never really need to run the below commands. They are all available within the
	Snorby interface but documented here just in case.

**Snorby Worker**

	Snorby::Worker.stop      # Stop The Snorby Worker
	Snorby::Worker.start     # Start The Snorby Worker
	Snorby::Worker.restart   # Restart The Snorby Worker

**Snorby Cache Jobs**
	
	# This will manually run the sensor cache job - pass true or false for verbose output
	Snorby::Jobs::SensorCacheJob.new(true).perform`

	# This will manually run the daily cache job - once again passing true or false for verbose output
	Snorby::Jobs::DailyCacheJob.new(true).perform

	# Clear All Snorby Cache - You must pass true to this method call for confirmation.
	Snorby::Jobs.clear_cache

	# If the Snorby worker is running this will start the cache jobs and set the run_at time for the current time.
	Snorby::Jobs.run_now!

## License

Please refer to the LICENSE file found in the root of the snorby project.


