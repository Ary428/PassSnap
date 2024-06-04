import React, { useState, useEffect } from "react";
import {
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Switch,
} from "@mui/material";
import { ContentCopy, Visibility, Sync, Refresh } from "@mui/icons-material";
import { AppContainer } from "./components/AppContainer";
import { ButtonContainer } from "./components/ButtonContainer";
import { IconContainer } from "./components/IconContainer";
import { SwitchContainer } from "./components/SwitchContainer";

function App() {
  const [action, setAction] = useState<"copy" | "reveal" | "copy_and_reveal">(
    "copy"
  );
  const [isDisabledForPage, setIsDisabledForPage] = useState(false);
  const [isDisabledForDomain, setIsDisabledForDomain] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url) {
        setCurrentUrl(activeTab.url);
      }
    });

    chrome.storage.local.get(
      [
        "passsnap_action",
        "passsnap_disabled_pages",
        "passsnap_disabled_domains",
      ],
      (result) => {
        console.log("Initial storage load: ", result);
        setAction(result.passsnap_action || "copy");
        const currentPage = window.location.href;
        const currentDomain = window.location.hostname;

        if (!currentPage.includes("chrome-extension://")) {
          const pageDisabled =
            result.passsnap_disabled_pages?.includes(currentPage) || false;
          const domainDisabled =
            result.passsnap_disabled_domains?.includes(currentDomain) || false;
          console.log({
            currentDomain,
            currentPage,
            pageDisabled,
            domainDisabled,
          });
          setIsDisabledForPage(pageDisabled);
          setIsDisabledForDomain(domainDisabled);
          updateIcon(pageDisabled, domainDisabled);
        }
      }
    );
  }, []);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedAction = event.target.value as
      | "copy"
      | "reveal"
      | "copy_and_reveal";
    if (selectedAction !== action) {
      setAction(selectedAction);
      setHasChanges(true);
      chrome.storage.local.set({ passsnap_action: selectedAction });
    }
  };

  const handleDisableToggle = (type: "page" | "domain") => {
    console.log(`handleDisableToggle called with type: ${type}`);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url) {
        try {
          const url = new URL(activeTab.url);
          const currentPage = url.href;
          const currentDomain = url.hostname;

          console.log(`Toggling disable for ${type}: `, {
            currentPage,
            currentDomain,
          });

          if (type === "page") {
            chrome.storage.local.get(["passsnap_disabled_pages"], (result) => {
              console.log(
                "Current disabled pages: ",
                result.passsnap_disabled_pages
              );
              if (chrome.runtime.lastError) {
                console.error(
                  "Error retrieving disabled pages:",
                  chrome.runtime.lastError
                );
                setHasChanges(false);
                alert("Error retrieving disabled pages. Please try again.");
                return;
              }
              const disabledPages: string[] =
                result.passsnap_disabled_pages || [];
              const updatedPages = isDisabledForPage
                ? disabledPages.filter((page: string) => page !== currentPage)
                : [...disabledPages, currentPage];
              console.log("Updated disabled pages: ", updatedPages);
              if (isDisabledForPage !== updatedPages.includes(currentPage)) {
                chrome.storage.local.set(
                  { passsnap_disabled_pages: updatedPages },
                  () => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Error updating disabled pages:",
                        chrome.runtime.lastError
                      );
                      setHasChanges(false);
                      alert("Error updating disabled pages. Please try again.");
                      return;
                    }
                    console.log("Disabled pages updated successfully.");
                    setIsDisabledForPage(!isDisabledForPage);
                    setHasChanges(true);
                    updateIcon(!isDisabledForPage, isDisabledForDomain);
                  }
                );
              } else {
                console.log("No change in disabled pages state.");
                setHasChanges(false);
              }
            });
          } else {
            chrome.storage.local.get(
              ["passsnap_disabled_domains"],
              (result) => {
                console.log(
                  "Current disabled domains: ",
                  result.passsnap_disabled_domains
                );
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error retrieving disabled domains:",
                    chrome.runtime.lastError
                  );
                  setHasChanges(false);
                  alert("Error retrieving disabled domains. Please try again.");
                  return;
                }
                const disabledDomains: string[] =
                  result.passsnap_disabled_domains || [];
                const updatedDomains = isDisabledForDomain
                  ? disabledDomains.filter(
                      (domain: string) => domain !== currentDomain
                    )
                  : [...disabledDomains, currentDomain];
                console.log("Updated disabled domains: ", updatedDomains);
                if (
                  isDisabledForDomain !== updatedDomains.includes(currentDomain)
                ) {
                  chrome.storage.local.set(
                    { passsnap_disabled_domains: updatedDomains },
                    () => {
                      if (chrome.runtime.lastError) {
                        console.error(
                          "Error updating disabled domains:",
                          chrome.runtime.lastError
                        );
                        setHasChanges(false);
                        alert(
                          "Error updating disabled domains. Please try again."
                        );
                        return;
                      }
                      console.log("Disabled domains updated successfully.");
                      setIsDisabledForDomain(!isDisabledForDomain);
                      setHasChanges(true);
                      updateIcon(isDisabledForPage, !isDisabledForDomain);
                    }
                  );
                } else {
                  console.log("No change in disabled domains state.");
                  setHasChanges(false);
                }
              }
            );
          }
        } catch (error) {
          console.error("Invalid URL detected:", activeTab.url, error);
          alert(
            "Invalid URL detected. Please ensure you are on a valid webpage."
          );
          setHasChanges(false);
        }
      } else {
        console.error("No active tab or URL found");
        alert(
          "No active tab or URL found. Please ensure a webpage is active and try again."
        );
        setHasChanges(false);
      }
    });
  };

  const updateIcon = (pageDisabled: boolean, domainDisabled: boolean) => {
    const iconPath =
      pageDisabled || domainDisabled
        ? "images/icon128_gray.png"
        : "images/icon128.png";
    chrome.action.setIcon({ path: iconPath });
    console.log("Icon updated to: ", iconPath);
  };

  const handleReload = () => {
    chrome.tabs.reload();
    setHasChanges(false);
  };

  const getMessage = (messageName: string) => {
    return chrome.i18n.getMessage(messageName);
  };

  const actions = [
    {
      value: "copy",
      label: getMessage("copyPassword"),
      icon: <ContentCopy fontSize="large" />,
      text: getMessage("copyEnabled"),
    },
    {
      value: "reveal",
      label: getMessage("revealPassword"),
      icon: <Visibility fontSize="large" />,
      text: getMessage("revealEnabled"),
    },
    {
      value: "copy_and_reveal",
      label: getMessage("copyAndRevealPassword"),
      icon: <Sync fontSize="large" />,
      text: getMessage("copyAndRevealEnabled"),
    },
  ];

  return (
    <AppContainer>
      <Typography variant="h5" gutterBottom>
        {getMessage("appName")}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Current URL: {currentUrl}
      </Typography>
      <RadioGroup value={action} onChange={handleRadioChange}>
        {actions.map((act) => (
          <FormControlLabel
            key={act.value}
            value={act.value}
            control={<Radio />}
            label={act.label}
          />
        ))}
      </RadioGroup>
      <IconContainer>
        {actions.find((act) => act.value === action)?.icon}
      </IconContainer>
      <Typography variant="body1" gutterBottom>
        {actions.find((act) => act.value === action)?.text}
      </Typography>
      <SwitchContainer>
        <FormControlLabel
          control={
            <Switch
              checked={isDisabledForPage}
              onChange={() => handleDisableToggle("page")}
              color="secondary"
            />
          }
          label={
            isDisabledForPage
              ? getMessage("enableForPage")
              : getMessage("disableForPage")
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={isDisabledForDomain}
              onChange={() => handleDisableToggle("domain")}
              color="secondary"
            />
          }
          label={
            isDisabledForDomain
              ? getMessage("enableForDomain")
              : getMessage("disableForDomain")
          }
        />
      </SwitchContainer>
      <ButtonContainer>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={handleReload}
          disabled={!hasChanges}
        >
          {getMessage("reloadPage")}
        </Button>
      </ButtonContainer>
    </AppContainer>
  );
}

export default App;
