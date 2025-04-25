
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, ExternalLink } from 'lucide-react';
import { LanguageData } from '@/utils/languageUtils';
import { useToast } from '@/components/ui/use-toast';

interface StudyResourcesPanelProps {
  language: LanguageData;
  roomName: string;
}

const StudyResourcesPanel: React.FC<StudyResourcesPanelProps> = ({ language, roomName }) => {
  const { toast } = useToast();
  const [resourceUrl, setResourceUrl] = useState('');
  const [resources, setResources] = useState(language.documentation);
  
  const handleAddResource = () => {
    if (!resourceUrl) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Quick validation of URL format
      new URL(resourceUrl);
      
      const newResource = {
        title: `Resource ${resources.length + 1}`,
        url: resourceUrl,
        description: "Custom resource"
      };
      
      setResources([...resources, newResource]);
      setResourceUrl('');
      
      toast({
        title: "Resource added",
        description: "Your resource has been added to the list"
      });
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="flex flex-col space-y-1.5">
        <CardTitle>Study Resources for {language.name}</CardTitle>
        <CardDescription>Share helpful links and resources with the room</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input 
              className="pl-10" 
              placeholder="Enter resource URL..." 
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleAddResource}>Add Resource</Button>
        </div>
        
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-grow">
                <div className="font-medium">{resource.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{resource.url}</div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyResourcesPanel;
