import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, GitFork, Star, Users, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

interface LanguageChartData {
  name: string;
  value: number;
}

interface GitHubStatsProps {
  username: string;
  maxRepos?: number;
  className?: string;
  defaultTheme?: 'light' | 'dark';
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ 
  username, 
  maxRepos = 6,
  className = '',
  defaultTheme = 'light'
}) => {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${maxRepos}`);
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const reposData = await reposResponse.json();
        
        setUserData(userData);
        setRepos(reposData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username, maxRepos]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error || !userData) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const languageData = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData: LanguageChartData[] = Object.entries(languageData).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Card className="mb-6 dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center gap-4">
            <img 
              src={userData.avatar_url} 
              alt={`${username}'s avatar`}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <CardTitle className="dark:text-white">{userData.name || username}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userData.bio}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center gap-2 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span>{userData.followers} followers</span>
            </div>
            <div className="flex items-center gap-2 dark:text-gray-300">
              <Star className="w-4 h-4" />
              <span>{repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)} stars</span>
            </div>
            <div className="flex items-center gap-2 dark:text-gray-300">
              <GitFork className="w-4 h-4" />
              <span>{repos.reduce((acc, repo) => acc + repo.forks_count, 0)} forks</span>
            </div>
            <div className="flex items-center gap-2 dark:text-gray-300">
              <Github className="w-4 h-4" />
              <span>{userData.public_repos} repos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="repos" className="w-full">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="repos" className="dark:text-gray-300">Repositories</TabsTrigger>
          <TabsTrigger value="stats" className="dark:text-gray-300">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="repos">
          <div className="grid gap-4">
            {repos.map(repo => (
              <Card key={repo.id} className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <a 
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 dark:text-white dark:hover:text-blue-400"
                    >
                      {repo.name}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{repo.description}</p>
                  <div className="flex gap-4 mt-2">
                    {repo.language && (
                      <span className="text-sm dark:text-gray-300">
                        <span className="font-medium">Language:</span> {repo.language}
                      </span>
                    )}
                    <span className="text-sm dark:text-gray-300">
                      <Star className="w-4 h-4 inline mr-1" />
                      {repo.stargazers_count}
                    </span>
                    <span className="text-sm dark:text-gray-300">
                      <GitFork className="w-4 h-4 inline mr-1" />
                      {repo.forks_count}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Languages Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name"
                      stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                    />
                    <YAxis
                      stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: theme === 'dark' ? 'white' : 'black'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={theme === 'dark' ? '#60a5fa' : '#4f46e5'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GitHubStats;