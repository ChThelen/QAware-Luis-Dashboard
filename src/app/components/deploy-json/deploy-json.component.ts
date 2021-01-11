import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LuisAppService } from 'src/app/services/luis-app.service';

@Component({
  selector: 'app-deploy-json',
  templateUrl: './deploy-json.component.html',
  styleUrls: ['./deploy-json.component.scss']
})
export class DeployJsonComponent implements OnInit 
{
  @Input() 
  jsonString:string;

  @Output()
  jsonStringChange = new EventEmitter<string>();

  settingModalOpened = false; 
  timelineStyle = {
    step0:{state:"success"},
    step1:{state:"processing"},
    step2:{state:"not-started"},
    step3:{state:"not-started"},
    step4:{state:"not-started"},
  }; 

  luis = {
    app: 
    {
      name: '',
      description: '',
      id: '',
      created:1,
      trained: 1,
      published:1,
      staging : true,
      production : false
    }
  };
  constructor(private luisService:LuisAppService){}

  ngOnInit(): void 
  {
    
  }
  
  createApp()
  {
    this.luisService.createApp(this.jsonString).subscribe(data=>{this.luis.app.id=data; console.log(data)});
    this.luis.app.created = 0;
    if(this.luis.app.id.length > 5 || this.luis.app.created == 0) // App has been created
    {
      this.manageTimeLineStyle();
      
    }
    else // App isn't created or already existing
    {
        //TODO : User must be notify 
    }
  }
  train()
  {
    this.luisService.train(this.jsonString).subscribe(data=>{this.luis.app.trained=data});
    this.luis.app.trained = 0;
    if(this.luis.app.trained == 0) // App is trained
    {
      this.manageTimeLineStyle();
    }
    else // App isn't trained
    {
    
        //TODO : User must be notify 
    }
  }
  publish()
  {
    this.luisService.publish(this.jsonString,this.luis.app.staging).subscribe(data=>{this.luis.app.published=data});
    this.luis.app.published = 0;
    if(this.luis.app.published == 0) // App is published
    {
      this.manageTimeLineStyle();
    }
    else // App isn't published
    {
        //TODO : User must be notify 
    }
  }
  
  manageTimeLineStyle()
  {
    if(this.luis.app.created == 0 && this.luis.app.trained == 1 && this.luis.app.published == 1)
    {
      this.timelineStyle.step1.state = "success";
      this.timelineStyle.step2.state = "current";
    }
    else if(this.luis.app.trained == 0 && this.luis.app.published == 1)
    {
      this.timelineStyle.step2.state = "success";
      this.timelineStyle.step3.state = "current";
    }
    if(this.luis.app.published == 0)
    {
      this.timelineStyle.step3.state = "success";
      this.timelineStyle.step4.state = "current";
    }
  }
  editNameAndDescription(name:string,description:string)
  {
    
   if(this.luis.app.name.trim()!="")
    {
      let startIndex = this.jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"name\"');
      let endIndex = this.jsonString.split(/\r\n|\n/).join("").indexOf(",",startIndex)+1;
      let oldName = this.jsonString.split(/\r\n|\n/).join("").substring(startIndex,endIndex);
      let newName = '\"name\":'+' \"'+ name.trim() +"\",";
      this.jsonString = this.jsonString.replace(oldName,newName);
    }
    if(this.luis.app.description.trim()!="")
    {
      let startIndex = this.jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"desc\"');
      let endIndex = this.jsonString.split(/\r\n|\n/).join("").indexOf(",",startIndex)+1;
      let oldDesc = this.jsonString.split(/\r\n|\n/).join("").substring(startIndex,endIndex);
      let newDesc = '\"desc\":'+' \"'+ description.trim() +"\",";
      this.jsonString = this.jsonString.replace(oldDesc,newDesc);
    }
  }
  jsonStringValueChanged()
  {
    this.jsonStringChange.emit(this.jsonString);
  }
  

}
