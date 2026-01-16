import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Trash2,
  Shield,
  Check,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Card {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<Card[]>([
    { id: "1", brand: "Visa", last4: "4242", expiry: "12/27", isDefault: true },
  ]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return "Visa";
    if (cleanNumber.startsWith("5")) return "Mastercard";
    if (cleanNumber.startsWith("3")) return "Amex";
    return "Card";
  };

  const handleAddCard = async () => {
    if (!cardNumber || !expiry || !cvv) {
      toast({
        title: "Missing Information",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCard: Card = {
      id: Date.now().toString(),
      brand: getCardBrand(cardNumber),
      last4: cardNumber.replace(/\s/g, "").slice(-4),
      expiry,
      isDefault: cards.length === 0,
    };

    setCards([...cards, newCard]);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setShowAddCard(false);
    setIsSubmitting(false);

    toast({
      title: "Card Added",
      description: "Your new payment method has been saved.",
    });
  };

  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
    toast({
      title: "Card Removed",
      description: "Payment method has been removed.",
    });
  };

  const handleSetDefault = (cardId: string) => {
    setCards(
      cards.map((c) => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    );
    toast({
      title: "Default Updated",
      description: "Your default payment method has been changed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Payment Method</h1>
        </div>
      </header>

      <main className="p-4 max-w-xl mx-auto space-y-6">
        {/* Existing Cards */}
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-card border rounded-xl ${
              card.isDefault ? "border-primary/50" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {card.brand} •••• {card.last4}
                    </p>
                    {card.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires {card.expiry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!card.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(card.id)}
                  >
                    Set Default
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Card?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this payment method?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveCard(card.id)}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Card */}
        {!showAddCard ? (
          <Button
            variant="outline"
            className="w-full h-14"
            onClick={() => setShowAddCard(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Card
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-6 bg-card border border-border rounded-xl space-y-4"
          >
            <h3 className="font-semibold">Add New Card</h3>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="pl-12"
                />
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {cardNumber.length > 4 && (
                  <Badge
                    variant="secondary"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  >
                    {getCardBrand(cardNumber)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddCard(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddCard}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Card
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg"
        >
          <Shield className="h-5 w-5 text-green-500" />
          <p className="text-sm text-muted-foreground">
            Secured by <span className="font-medium">Paystack</span>. Your card
            details are never stored by us.
          </p>
        </motion.div>

        {/* Coach Mark */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-primary">
            💡 <strong>Tip:</strong> Your card details are encrypted and never stored directly. All payments are processed securely through Paystack.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentMethod;
