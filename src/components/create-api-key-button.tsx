"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { generateAPIKey } from "@/lib/server-utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { DialogHeader } from "./ui/dialog";

export default function CreateAPIKeyButton() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleClick = async () => {
    const apiKey = await generateAPIKey();

    if (!apiKey) {
      toast.error("Failed to create API key");
      return;
    }

    setApiKey(apiKey);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleClick}>Create API Key</Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-700 border border-black rounded-md">
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
          <DialogDescription>
            <Input
              className="border border-black bg-gray-600 text-white text-center"
              readOnly
              value={apiKey || ""}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
