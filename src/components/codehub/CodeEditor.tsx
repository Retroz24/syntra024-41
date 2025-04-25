
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LanguageData } from '@/utils/languageUtils';

interface CodeEditorProps {
  language: LanguageData;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language }) => {
  const { toast } = useToast();
  const [code, setCode] = useState(language.defaultImport);
  
  useEffect(() => {
    setCode(language.defaultImport);
  }, [language]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    });
  };
  
  const handleShare = () => {
    // In a real implementation, this would share with room members
    toast({
      title: "Code shared",
      description: "Code has been shared with room members",
    });
  };

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {language.name} Code Editor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-1"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-0 right-0 bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-bl">
            {language.fileExtension}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck="false"
            style={{ 
              tabSize: 2,
              lineHeight: 1.5
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
