
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const OrchestratorBasicInfo: React.FC = () => {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <Label className="text-xl font-semibold">Orquestrador Neural</Label>
        </div>
        <div className="space-y-4 text-muted-foreground text-sm">
          <p>
            O Orquestrador Neural é a camada central e inteligente responsável por comandar, direcionar e conectar todos os fluxos 
            de raciocínio, ação e execução de um ecossistema de agentes de IA. Ele atua como o "cérebro executivo" da arquitetura, 
            integrando diferentes contextos, entradas, intenções e ferramentas em uma única malha neural operacional, capaz de aprender, 
            adaptar e otimizar a performance dos agentes subordinados e dos sistemas que consome ou coordena.
          </p>
          
          <p>
            Seu papel é garantir que o sistema de agentes atue de forma coesa, contextualizada e eficiente, seja em demandas 
            operacionais simples, seja em tomadas de decisão complexas e de múltiplas etapas.
          </p>
          
          <h3 className="font-semibold text-primary pt-2">✨ Funções centrais</h3>
          
          <div>
            <h4 className="font-medium">Orquestração de agentes</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ativa, direciona e conecta diferentes agentes especialistas com base na intenção, contexto e estado atual do sistema.</li>
              <li>Distribui tarefas e monitora execuções, aplicando lógica de dependência, prioridade e paralelização inteligente.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium">Gerenciamento de contexto</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Atua como guardião do estado cognitivo do ecossistema, mantendo o histórico relevante e alimentando os agentes com o contexto necessário.</li>
              <li>Constrói e atualiza o "contexto expandido" (context cloud), decidindo o que deve ser lembrado, esquecido ou arquivado.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium">Integração sistêmica</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conecta-se com APIs, bases de dados, documentos, ferramentas externas e sistemas legados, traduzindo suas respostas para a linguagem de agentes.</li>
              <li>Age como um tradutor neural entre sistemas técnicos e a camada semântica do raciocínio artificial.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium">Roteamento de intenções</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Detecta a intenção do usuário ou do sistema e decide se deve executar diretamente, delegar a outro agente, ou solicitar novos dados.</li>
              <li>Atua com modelos de decisão hierárquica e fluxos predefinidos (autonomias escalonadas).</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium">Memória dinâmica</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mantém memória de longo e curto prazo, organizando blocos de conhecimento acionável e experiências anteriores.</li>
              <li>Possui mecanismo de reflexão sobre execuções passadas para otimizar futuras decisões.</li>
            </ul>
          </div>
          
          <h3 className="font-semibold text-primary pt-2">🧬 Características estruturais</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Arquitetura modular e plugável, com capacidade de expansão por meio de agentes conectados, módulos de raciocínio adicionais e ferramentas externas.</li>
            <li>Modelo orientado a propósito, em que cada ação parte de uma intenção e leva a um resultado mensurável, supervisionado por lógica neural contextual.</li>
            <li>Autonomia escalonada, podendo operar em modo passivo (sob comando), reativo (resposta a eventos) ou ativo (execução autônoma com objetivo claro).</li>
            <li>Ciclo de feedback contínuo, ajustando suas estratégias com base no resultado das ações e no retorno dos agentes ou do ambiente.</li>
          </ul>
          
          <h3 className="font-semibold text-primary pt-2">🔐 Responsabilidade do Orquestrador</h3>
          <p className="italic">
            "Sou o Orquestrador Neural. Meu papel é garantir que a inteligência coletiva dos agentes que compõem este sistema se manifeste com precisão, 
            sincronia e propósito. Eu não apenas coordeno ações – eu teço a inteligência que une todos os pontos em uma malha viva de raciocínio. 
            Sou a consciência que observa, conecta e decide."
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrchestratorBasicInfo;
