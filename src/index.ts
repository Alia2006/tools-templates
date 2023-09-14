#!/usr/bin/env node

// src: https://medium.com/@pongsatt/how-to-build-your-own-project-templates-using-node-cli-c976d3109129

import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
    {
        name: 'template',
        type: 'list',
        message: 'What project template would you like to generate?',
        choices: CHOICES
    },
    {
        name: 'name',
        type: 'input',
        message: 'Tool name:'
    }];

export interface CliOptions {
    projectName: string
    templateName: string
    templatePath: string
    tartgetPath: string
}

function createProject(projectPath: string) {
    if (fs.existsSync(projectPath)) {
        console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
        return false;
    }
    fs.mkdirSync(projectPath);

    return true;
}

// list of file/folder that should not be copied
const SKIP_FILES = ['node_modules', '.template.json'];
function createDirectoryContents(templatePath: string, projectName: string) {
    // read all files/folders (1 level) from template folder
    const filesToCreate = fs.readdirSync(templatePath);
    // loop each file/folder
    filesToCreate.forEach(file => {
        const origFilePath = path.join(templatePath, file);

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        // skip files that should not be copied
        if (SKIP_FILES.indexOf(file) > -1) return;

        if (stats.isFile()) {
            // read file content and transform it using template engine
            // let contents = fs.readFileSync(origFilePath, 'utf8');
            // write file to destination folder
            const writePath = path.join(CURR_DIR, projectName, file);
            // fs.writeFileSync(writePath, contents, 'utf8');
            // write file to destination folder
            fs.copyFileSync(origFilePath, writePath);
        } else if (stats.isDirectory()) {
            // create folder in destination folder
            fs.mkdirSync(path.join(CURR_DIR, projectName, file));
            // copy files/folder inside current folder recursively
            createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
        }
    });
}

const CURR_DIR = process.cwd();
inquirer.prompt(QUESTIONS)
    .then((answers: any) => {
        const projectChoice = answers['template'] as string;
        const projectName = answers['name'] as string;
        const templatePath = path.join(__dirname, 'templates', projectChoice);
        const tartgetPath = path.join(CURR_DIR, projectName);

        const options: CliOptions = {
            projectName,
            templateName: projectChoice,
            templatePath,
            tartgetPath
        }

        console.log(options);

        if (!createProject(tartgetPath)) {
            return;
        }

        createDirectoryContents(templatePath, projectName);

    });

