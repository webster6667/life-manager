import { resolve } from 'path'
import { StorybookConfig } from '@storybook/react-vite';
import { InlineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';


const config: StorybookConfig & {stories: string[], addons?: string[]} = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite', // Добавляем core.builder для правильного связывания с Vite
  },
  // Конфигурация для Vite
  viteFinal: async (viteConfig: InlineConfig) => {
    // Добавляем плагин для поддержки alias путей из tsconfig.json
    viteConfig.plugins = viteConfig.plugins || [];
    viteConfig.plugins.push(tsconfigPaths({      projects: ['./tsconfig.json']
    }));

    // Настройка для загрузки SVG с помощью Vite
    viteConfig.plugins.push(
      svgrPlugin({
        svgrOptions: {
          icon: true, // Использовать иконки в формате SVG
        },
      })
    );

    return viteConfig;
  },
};

export default config;
